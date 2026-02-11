import { z } from 'zod';

export const PlaceSchema = z.object({
    id: z.string().uuid().optional(),
    vehiculeId: z.string().uuid(),
    numero: z.string().min(1),
    classe: z.enum(['ECONOMIQUE', 'CONFORT', 'BUSINESS', 'PREMIERE', 'VIP']),
    typeSiege: z.enum(['STANDARD', 'FENETRE', 'COULOIR', 'INCLINABLE', 'COUCHETTE']),
    position: z.enum(['AVANT', 'MILIEU', 'ARRIERE', 'SUPERIEUR', 'INFERIEUR']),
    prixBase: z.number().positive(),
    caracteristiques: z.array(z.string()).optional(),
    estDisponible: z.boolean().default(true),
});

export type Place = z.infer<typeof PlaceSchema>;