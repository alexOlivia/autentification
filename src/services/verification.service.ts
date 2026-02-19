import { prisma } from '../config/database.js';
import type { TypeVerification } from '@prisma/client';
import { generateVerificationCode } from '../utils/code-generator.js';
import { MAX_VERIFICATION_ATTEMPTS } from '../utils/constants.js';
import { verificationCodeExpiry } from '../config/jwt.js';
import { AuthenticationError, NotFoundError } from '../utils/errors.js';
import { sendVerificationCode } from './notification.service.js';

function getExpirySeconds(type: TypeVerification): number {
  switch (type) {
    case 'TELEPHONE':
    case 'DOUBLE_AUTHENTIFICATION':
      return verificationCodeExpiry.SMS;
    case 'EMAIL':
      return verificationCodeExpiry.EMAIL;
    case 'RESET_PASSWORD':
      return verificationCodeExpiry.RESET_PASSWORD;
  }
}

export async function generateCode(
  utilisateurId: string,
  typeVerification: TypeVerification,
): Promise<{ code: string; dateExpiration: Date }> {
  // Invalider les anciens codes non utilisés du même type
  await prisma.codeVerification.updateMany({
    where: { utilisateurId, typeVerification, estUtilise: false },
    data: { estUtilise: true },
  });

  const code = generateVerificationCode();
  const expirySeconds = getExpirySeconds(typeVerification);
  const dateExpiration = new Date(Date.now() + expirySeconds * 1000);

  await prisma.codeVerification.create({
    data: {
      utilisateurId,
      code,
      typeVerification,
      dateExpiration,
    },
  });

  return { code, dateExpiration };
}

export async function verifyCode(
  utilisateurId: string,
  code: string,
  typeVerification: TypeVerification,
): Promise<boolean> {
  const record = await prisma.codeVerification.findFirst({
    where: { utilisateurId, typeVerification, estUtilise: false },
    orderBy: { createdAt: 'desc' },
  });

  if (!record) {
    throw new NotFoundError('Code', 'Aucun code de vérification actif trouvé');
  }

  if (record.dateExpiration < new Date()) {
    await prisma.codeVerification.update({
      where: { id: record.id },
      data: { estUtilise: true },
    });
    throw new AuthenticationError('CODE_EXPIRE', 'Le code de vérification a expiré');
  }

  if (record.code !== code) {
    const newCount = record.nombreTentatives + 1;

    if (newCount >= MAX_VERIFICATION_ATTEMPTS) {
      // Marquer comme utilisé et régénérer un nouveau code
      await prisma.codeVerification.update({
        where: { id: record.id },
        data: { estUtilise: true, nombreTentatives: newCount },
      });

      // Envoyer un nouveau code automatiquement
      const utilisateur = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId },
        select: { telephone: true, email: true },
      });

      if (utilisateur) {
        const { code: newCode } = await generateCode(utilisateurId, typeVerification);
        const channel = typeVerification === 'EMAIL' ? 'EMAIL' : 'SMS';
        const destination = channel === 'EMAIL' ? utilisateur.email! : utilisateur.telephone;
        await sendVerificationCode(channel, destination, newCode);
      }

      throw new AuthenticationError(
        'NOMBRE_TENTATIVES_DEPASSE',
        'Nombre maximum de tentatives atteint. Un nouveau code a été envoyé.',
      );
    }

    await prisma.codeVerification.update({
      where: { id: record.id },
      data: { nombreTentatives: newCount },
    });
    throw new AuthenticationError('CODE_INVALIDE', 'Code de vérification invalide');
  }

  // Code correct
  await prisma.codeVerification.update({
    where: { id: record.id },
    data: { estUtilise: true },
  });

  return true;
}

export async function resendCode(
  utilisateurId: string,
  typeVerification: TypeVerification,
): Promise<void> {
  const utilisateur = await prisma.utilisateur.findUnique({
    where: { id: utilisateurId },
    select: { telephone: true, email: true },
  });

  if (!utilisateur) {
    throw new NotFoundError('Utilisateur');
  }

  const { code } = await generateCode(utilisateurId, typeVerification);
  const channel = typeVerification === 'EMAIL' ? 'EMAIL' : 'SMS';
  const destination = channel === 'EMAIL' ? utilisateur.email! : utilisateur.telephone;
  await sendVerificationCode(channel, destination, code);
}
