import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  identifiant: z.string().min(1, 'Email ou téléphone requis'),
});

export const resetPasswordSchema = z.object({
  utilisateurId: z.string().uuid(),
  code: z.string().length(6).regex(/^\d{6}$/),
  nouveauMotDePasse: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule requise')
    .regex(/[0-9]/, 'Au moins un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial requis'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
