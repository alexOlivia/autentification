import { prisma } from '../config/database.js';
import type { SessionInfo } from '../types/auth.js';
import { NotFoundError, AuthorizationError } from '../utils/errors.js';
import * as tokenService from './token.service.js';
import { getGeoFromIP, formatLocalisation, isNewCountry } from '../utils/geolocation.js';
import { parseUserAgent } from '../utils/device-parser.js';

interface CreateSessionInput {
  utilisateurId: string;
  tokenId: string;
  adresseIP?: string;
  userAgent?: string;
}

export interface CreateSessionResult {
  sessionId: string;
  isNewCountry: boolean;
  localisation: string;
  appareil: string;
}

export async function createSession(data: CreateSessionInput): Promise<CreateSessionResult> {
  // Parser le user agent pour les infos appareil
  const deviceInfo = parseUserAgent(data.userAgent);

  // Résoudre la géolocalisation via IP
  const geo = await getGeoFromIP(data.adresseIP ?? '');
  const localisation = formatLocalisation(geo);

  // Détecter si c'est un nouveau pays
  const newCountry = await isNewCountry(data.utilisateurId, geo.codePays, prisma);

  const session = await prisma.sessionUtilisateur.create({
    data: {
      utilisateurId: data.utilisateurId,
      tokenId: data.tokenId,
      appareil: deviceInfo.appareil,
      navigateur: deviceInfo.navigateur,
      systemeExploitation: deviceInfo.systemeExploitation,
      adresseIP: data.adresseIP,
      localisation,
    },
  });

  return {
    sessionId: session.id,
    isNewCountry: newCountry,
    localisation,
    appareil: deviceInfo.appareil,
  };
}

export async function getUserActiveSessions(utilisateurId: string): Promise<SessionInfo[]> {
  return prisma.sessionUtilisateur.findMany({
    where: { utilisateurId, estActive: true },
    select: {
      id: true,
      appareil: true,
      navigateur: true,
      systemeExploitation: true,
      adresseIP: true,
      localisation: true,
      dateDebut: true,
      estActive: true,
    },
    orderBy: { dateDebut: 'desc' },
  });
}

export async function revokeSession(sessionId: string, utilisateurId: string): Promise<void> {
  const session = await prisma.sessionUtilisateur.findUnique({
    where: { id: sessionId },
    include: { token: true },
  });

  if (!session) {
    throw new NotFoundError('Session');
  }

  if (session.utilisateurId !== utilisateurId) {
    throw new AuthorizationError('Vous ne pouvez pas révoquer cette session');
  }

  await prisma.sessionUtilisateur.update({
    where: { id: sessionId },
    data: { estActive: false, dateFin: new Date() },
  });

  // Révoquer le token associé
  await tokenService.revokeToken(session.tokenId);
  await tokenService.blacklistToken(session.token.token);
}

export async function revokeAllUserSessions(utilisateurId: string): Promise<void> {
  await prisma.sessionUtilisateur.updateMany({
    where: { utilisateurId, estActive: true },
    data: { estActive: false, dateFin: new Date() },
  });
}

export async function endSessionByTokenId(tokenId: string): Promise<void> {
  await prisma.sessionUtilisateur.updateMany({
    where: { tokenId, estActive: true },
    data: { estActive: false, dateFin: new Date() },
  });
}
