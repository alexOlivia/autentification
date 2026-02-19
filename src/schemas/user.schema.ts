import { z } from 'zod';

export const updateProfileSchema = z.object({
  prenom: z.string().min(2).max(50).optional(),
  nom: z.string().min(2).max(50).optional(),
  urlAvatar: z.string().url().optional(),
  dateNaissance: z.string().datetime().optional(),
  email: z.string().email().optional(),
});

export const changePasswordSchema = z.object({
  ancienMotDePasse: z.string().min(1, 'Ancien mot de passe requis'),
  nouveauMotDePasse: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule requise')
    .regex(/[0-9]/, 'Au moins un chiffre requis')
    .regex(/[^A-Za-z0-9]/, 'Au moins un caractère spécial requis'),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(['CLIENT', 'COMMERCANT', 'ADMIN']).optional(),
  statut: z.enum(['ACTIF', 'INACTIF', 'SUSPENDU']).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>;
