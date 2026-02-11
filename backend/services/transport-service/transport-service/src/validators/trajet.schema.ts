import { z } from 'zod';

export const trajetSchema = z.object({
    origine: z.string().min(1, "L'origine est requise"),
    destination: z.string().min(1, "La destination est requise"),
    heureDepart: z.date().refine(date => date > new Date(), {
        message: "L'heure de départ doit être dans le futur",
    }),
    ligneId: z.string().uuid("L'ID de la ligne doit être un UUID valide"),
    vehiculeId: z.string().uuid("L'ID du véhicule doit être un UUID valide"),
    chauffeurId: z.string().uuid("L'ID du chauffeur doit être un UUID valide"),
});

export type TrajetInput = z.infer<typeof trajetSchema>;