import { prisma } from '../config/database.js';
import { hashPassword } from '../utils/hash.js';
import { NotFoundError } from '../utils/errors.js';
import * as verificationService from './verification.service.js';
import * as tokenService from './token.service.js';
import * as sessionService from './session.service.js';
import { sendVerificationCode } from './notification.service.js';

export async function forgotPassword(identifiant: string): Promise<{ message: string }> {
  // Chercher par email ou téléphone
  const utilisateur = await prisma.utilisateur.findFirst({
    where: {
      OR: [
        { email: identifiant },
        { telephone: identifiant },
      ],
      statut: { not: 'SUPPRIME' },
    },
    select: { id: true, telephone: true, email: true },
  });

  // Retourner un message générique même si l'utilisateur n'existe pas
  // pour empêcher l'énumération d'utilisateurs
  if (!utilisateur) {
    return { message: 'Si un compte existe avec cet identifiant, un code de vérification a été envoyé' };
  }

  const { code } = await verificationService.generateCode(utilisateur.id, 'RESET_PASSWORD');

  // Priorité SMS (contexte africain)
  await sendVerificationCode('SMS', utilisateur.telephone, code);

  return { message: 'Si un compte existe avec cet identifiant, un code de vérification a été envoyé' };
}

export async function resetPassword(
  utilisateurId: string,
  code: string,
  nouveauMotDePasse: string,
): Promise<void> {
  // Vérifier le code
  await verificationService.verifyCode(utilisateurId, code, 'RESET_PASSWORD');

  // Hacher le nouveau mot de passe
  const hash = await hashPassword(nouveauMotDePasse);

  // Mettre à jour le mot de passe
  await prisma.utilisateur.update({
    where: { id: utilisateurId },
    data: { motDePasse: hash },
  });

  // Révoquer tous les tokens et sessions (sécurité)
  await tokenService.revokeAllUserTokens(utilisateurId);
  await sessionService.revokeAllUserSessions(utilisateurId);
}
