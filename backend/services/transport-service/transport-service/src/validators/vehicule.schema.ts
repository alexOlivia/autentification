import { z } from 'zod';

export const vehiculeSchema = z.object({
    commercantId: z.string().nonempty("Le champ 'commercantId' est requis."),
    typeTransport: z.enum(['BUS', 'MINIBUS', 'TRAIN', 'AVION', 'METRO', 'VTC', 'TAXI', 'BATEAU']),
    immatriculation: z.string().nonempty("Le champ 'immatriculation' est requis."),
    marque: z.string().nonempty("Le champ 'marque' est requis."),
    modele: z.string().nonempty("Le champ 'modele' est requis."),
    compagnie: z.string().nonempty("Le champ 'compagnie' est requis."),
    capaciteTotale: z.number().int().positive("La 'capaciteTotale' doit être un nombre positif."),
    annee: z.number().int().min(1886, "L'année doit être supérieure ou égale à 1886."),
    equipements: z.array(z.string()).optional(),
    estActif: z.boolean().optional(),
    urlPhoto: z.string().url().optional(),
    dateCreation: z.date().optional(),
});

export type Vehicule = z.infer<typeof vehiculeSchema>;