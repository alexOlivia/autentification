import { prisma } from '../config/database.js';
import { tokenExpirySeconds } from '../config/jwt.js';
import type { JwtPayload, LoginResult, Login2FARequiredResult, RegistrationResult, TokenPair } from '../types/auth.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { verifyRefreshToken } from '../utils/jwt.js';
import {
  AuthenticationError,
  ConflictError,
  RateLimitError,
} from '../utils/errors.js';
import * as tokenService from './token.service.js';
import * as sessionService from './session.service.js';
import * as verificationService from './verification.service.js';
import * as loginAttemptService from './login-attempt.service.js';
import { sendVerificationCode, sendNewSessionAlert, send2FACode } from './notification.service.js';
import { getWebSocketServer } from '../config/websocket.js';

interface RegisterInput {
  telephone: string;
  email?: string;
  motDePasse: string;
  prenom: string;
  nom: string;
  dateNaissance?: string;
  role: 'CLIENT' | 'COMMERCANT';
}

export async function register(data: RegisterInput): Promise<RegistrationResult> {
  // Vérifier si le téléphone existe déjà
  const existingPhone = await prisma.utilisateur.findUnique({
    where: { telephone: data.telephone },
  });
  if (existingPhone) {
    throw new ConflictError('Ce numéro de téléphone est déjà utilisé');
  }

  // Vérifier si l'email existe déjà
  if (data.email) {
    const existingEmail = await prisma.utilisateur.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new ConflictError('Cet email est déjà utilisé');
    }
  }

  const hash = await hashPassword(data.motDePasse);

  const utilisateur = await prisma.utilisateur.create({
    data: {
      telephone: data.telephone,
      email: data.email,
      motDePasse: hash,
      prenom: data.prenom,
      nom: data.nom,
      dateNaissance: data.dateNaissance ? new Date(data.dateNaissance) : undefined,
      role: data.role,
      statut: 'EN_ATTENTE_VERIFICATION',
    },
    select: { id: true, telephone: true, statut: true },
  });

  // Générer et envoyer le code de vérification SMS
  const { code } = await verificationService.generateCode(utilisateur.id, 'TELEPHONE');
  await sendVerificationCode('SMS', data.telephone, code);

  return {
    utilisateur,
    message: 'Compte créé. Un code de vérification a été envoyé par SMS.',
  };
}

export async function login(
  identifiant: string,
  motDePasse: string,
  adresseIP: string,
  userAgent: string,
): Promise<LoginResult | Login2FARequiredResult> {
  // Vérifier le blocage brute force
  const blocked = await loginAttemptService.isBlocked(identifiant, adresseIP);
  if (blocked.blocked) {
    throw new RateLimitError(
      `Compte temporairement bloqué. Réessayez dans ${Math.ceil((blocked.remainingSeconds ?? 0) / 60)} minutes.`,
    );
  }

  // Chercher l'utilisateur par email ou téléphone
  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        { email: identifiant },
        { telephone: identifiant },
      ],
    },
  });

  if (!utilisateur) {
    await loginAttemptService.recordAttempt({
      email: identifiant.includes('@') ? identifiant : undefined,
      telephone: !identifiant.includes('@') ? identifiant : undefined,
      adresseIP,
      reussi: false,
      motifEchec: 'Identifiant inexistant',
      userAgent,
    });
    throw new AuthenticationError('IDENTIFIANTS_INVALIDES', 'Identifiants invalides');
  }

  // Vérifier le mot de passe
  const passwordValid = await comparePassword(motDePasse, utilisateur.motDePasse);
  if (!passwordValid) {
    await loginAttemptService.recordAttempt({
      email: utilisateur.email ?? undefined,
      telephone: utilisateur.telephone,
      adresseIP,
      reussi: false,
      motifEchec: 'Mot de passe incorrect',
      userAgent,
    });
    throw new AuthenticationError('IDENTIFIANTS_INVALIDES', 'Identifiants invalides');
  }

  // Vérifier le statut du compte
  switch (utilisateur.statut) {
    case 'SUSPENDU':
      throw new AuthenticationError('COMPTE_SUSPENDU', 'Votre compte est suspendu');
    case 'SUPPRIME':
      throw new AuthenticationError('COMPTE_SUPPRIME', 'Ce compte n\'existe plus');
    case 'EN_ATTENTE_VERIFICATION':
      throw new AuthenticationError(
        'COMPTE_NON_VERIFIE',
        'Veuillez vérifier votre numéro de téléphone avant de vous connecter',
      );
    case 'INACTIF':
      throw new AuthenticationError('COMPTE_INACTIF', 'Votre compte est inactif');
  }

  // Enregistrer la tentative réussie
  await loginAttemptService.recordAttempt({
    email: utilisateur.email ?? undefined,
    telephone: utilisateur.telephone,
    adresseIP,
    reussi: true,
    userAgent,
  });

  // Réinitialiser le compteur brute force
  await loginAttemptService.resetAttempts(identifiant);

  // Mettre à jour le dernier accès
  await prisma.utilisateur.update({
    where: { id: utilisateur.id },
    data: { dernierAcces: new Date() },
  });

  // Générer les tokens
  const payload: JwtPayload = {
    id: utilisateur.id,
    role: utilisateur.role,
    email: utilisateur.email ?? undefined,
    telephone: utilisateur.telephone,
  };

  const tokens = tokenService.generateTokenPair(payload);

  // Sauvegarder le refresh token en DB
  const tokenRecord = await tokenService.saveToken({
    utilisateurId: utilisateur.id,
    token: tokens.refreshToken,
    typeToken: 'REFRESH',
    dateExpiration: new Date(Date.now() + tokenExpirySeconds.REFRESH * 1000),
    adresseIP,
    userAgent,
  });

  // Créer la session avec géolocalisation
  const sessionResult = await sessionService.createSession({
    utilisateurId: utilisateur.id,
    tokenId: tokenRecord.id,
    adresseIP,
    userAgent,
  });

  // Si nouveau pays détecté, déclencher la 2FA
  if (sessionResult.isNewCountry) {
    const { code } = await verificationService.generateCode(utilisateur.id, 'DOUBLE_AUTHENTIFICATION');
    await send2FACode(utilisateur.telephone, utilisateur.email, code);

    return {
      requires2FA: true,
      utilisateurId: utilisateur.id,
      message: 'Connexion depuis un nouveau pays détectée. Un code de vérification a été envoyé.',
    };
  }

  // Notifier l'utilisateur de la nouvelle session via WebSocket
  const io = getWebSocketServer();
  if (io) {
    io.to(`user:${utilisateur.id}`).emit('new-session', {
      appareil: sessionResult.appareil,
      localisation: sessionResult.localisation,
      date: new Date().toISOString(),
    });
  }

  // Envoyer une alerte SMS/email pour la nouvelle session
  sendNewSessionAlert(
    utilisateur.email,
    utilisateur.telephone,
    { appareil: sessionResult.appareil, localisation: sessionResult.localisation },
  ).catch((err) => console.error('Erreur alerte nouvelle session:', err));

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    utilisateur: {
      id: utilisateur.id,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      role: utilisateur.role,
    },
  };
}

export async function verify2FA(
  utilisateurId: string,
  code: string,
  adresseIP: string,
  userAgent: string,
): Promise<LoginResult> {
  // Vérifier le code 2FA
  await verificationService.verifyCode(utilisateurId, code, 'DOUBLE_AUTHENTIFICATION');

  // Récupérer l'utilisateur
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
  });

  if (!utilisateur) {
    throw new AuthenticationError('IDENTIFIANTS_INVALIDES', 'Utilisateur introuvable');
  }

  // Générer les tokens
  const payload: JwtPayload = {
    id: utilisateur.id,
    role: utilisateur.role,
    email: utilisateur.email ?? undefined,
    telephone: utilisateur.telephone,
  };

  const tokens = tokenService.generateTokenPair(payload);

  // Sauvegarder le refresh token
  const tokenRecord = await tokenService.saveToken({
    utilisateurId: utilisateur.id,
    token: tokens.refreshToken,
    typeToken: 'REFRESH',
    dateExpiration: new Date(Date.now() + tokenExpirySeconds.REFRESH * 1000),
    adresseIP,
    userAgent,
  });

  // Créer la session
  const sessionResult = await sessionService.createSession({
    utilisateurId: utilisateur.id,
    tokenId: tokenRecord.id,
    adresseIP,
    userAgent,
  });

  // Notifier via WebSocket
  const io = getWebSocketServer();
  if (io) {
    io.to(`user:${utilisateur.id}`).emit('new-session', {
      appareil: sessionResult.appareil,
      localisation: sessionResult.localisation,
      date: new Date().toISOString(),
    });
  }

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    utilisateur: {
      id: utilisateur.id,
      prenom: utilisateur.prenom,
      nom: utilisateur.nom,
      email: utilisateur.email,
      telephone: utilisateur.telephone,
      role: utilisateur.role,
    },
  };
}

export async function refreshToken(
  refreshTokenStr: string,
  adresseIP: string,
  userAgent: string,
): Promise<TokenPair> {
  // Vérifier la signature du refresh token
  const decoded = verifyRefreshToken(refreshTokenStr);

  // Vérifier en DB que le token existe et n'est pas révoqué
  const tokenRecord = await tokenService.findRefreshTokenRecord(refreshTokenStr);
  if (!tokenRecord) {
    throw new AuthenticationError('TOKEN_INVALIDE', 'Refresh token invalide ou révoqué');
  }

  // Vérifier que le token n'est pas blacklisté
  const blacklisted = await tokenService.isTokenBlacklisted(refreshTokenStr);
  if (blacklisted) {
    await tokenService.revokeAllUserTokens(tokenRecord.utilisateurId);
    await sessionService.revokeAllUserSessions(tokenRecord.utilisateurId);
    throw new AuthenticationError('TOKEN_REVOQUE', 'Token révoqué. Toutes vos sessions ont été fermées par sécurité.');
  }

  // Révoquer l'ancien refresh token (rotation)
  await tokenService.revokeToken(tokenRecord.id);
  await tokenService.blacklistToken(refreshTokenStr);

  // Fermer l'ancienne session
  await sessionService.endSessionByTokenId(tokenRecord.id);

  // Générer de nouveaux tokens
  const payload: JwtPayload = {
    id: decoded.id,
    role: decoded.role,
    email: decoded.email,
    telephone: decoded.telephone,
  };

  const newTokens = tokenService.generateTokenPair(payload);

  // Sauvegarder le nouveau refresh token
  const newTokenRecord = await tokenService.saveToken({
    utilisateurId: decoded.id,
    token: newTokens.refreshToken,
    typeToken: 'REFRESH',
    dateExpiration: new Date(Date.now() + tokenExpirySeconds.REFRESH * 1000),
    adresseIP,
    userAgent,
  });

  // Créer une nouvelle session
  await sessionService.createSession({
    utilisateurId: decoded.id,
    tokenId: newTokenRecord.id,
    adresseIP,
    userAgent,
  });

  return newTokens;
}

export async function logout(
  utilisateurId: string,
  accessToken: string,
  refreshTokenStr?: string,
): Promise<void> {
  // Blacklister l'access token
  await tokenService.blacklistToken(accessToken);

  // Si un refresh token est fourni, le révoquer aussi
  if (refreshTokenStr) {
    const tokenRecord = await tokenService.findRefreshTokenRecord(refreshTokenStr);
    if (tokenRecord && tokenRecord.utilisateurId === utilisateurId) {
      await tokenService.revokeToken(tokenRecord.id);
      await tokenService.blacklistToken(refreshTokenStr);
      await sessionService.endSessionByTokenId(tokenRecord.id);
    }
  }
}
