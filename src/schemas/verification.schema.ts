import { z } from 'zod';

export const verifyCodeSchema = z.object({
  utilisateurId: z.string().uuid(),
  code: z.string().length(6, 'Le code doit contenir 6 chiffres').regex(/^\d{6}$/, 'Le code doit être numérique'),
  typeVerification: z.enum(['EMAIL', 'TELEPHONE', 'RESET_PASSWORD', 'DOUBLE_AUTHENTIFICATION']),
});

export const resendCodeSchema = z.object({
  utilisateurId: z.string().uuid(),
  typeVerification: z.enum(['EMAIL', 'TELEPHONE', 'RESET_PASSWORD', 'DOUBLE_AUTHENTIFICATION']),
});

export type VerifyCodeInput = z.infer<typeof verifyCodeSchema>;
export type ResendCodeInput = z.infer<typeof resendCodeSchema>;
