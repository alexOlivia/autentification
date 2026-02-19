import { z } from 'zod';

export const registerSchema = z.object({
  telephone: z.string().regex(/^\+\d{10,15}$/, 'Format téléphone invalide (ex: +22507XXXXXXXX)'),
  email: z.string().email('Format email invalide').optional(),
  motDePasse: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule requise')
    .regex(/[0-9]/, 'Au moins un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial requis'),
  prenom: z.string().min(2, 'Minimum 2 caractères').max(50),
  nom: z.string().min(2, 'Minimum 2 caractères').max(50),
  dateNaissance: z.string().datetime().optional(),
  role: z.enum(['CLIENT', 'COMMERCANT']).default('CLIENT'),
});

export const loginSchema = z.object({
  identifiant: z.string().min(1, 'Identifiant requis'),
  motDePasse: z.string().min(1, 'Mot de passe requis'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requis'),
});

export const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export const verify2FASchema = z.object({
  utilisateurId: z.string().uuid('ID utilisateur invalide'),
  code: z.string().length(6, 'Le code doit contenir 6 chiffres').regex(/^\d{6}$/, 'Le code doit être composé de 6 chiffres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type Verify2FAInput = z.infer<typeof verify2FASchema>;
