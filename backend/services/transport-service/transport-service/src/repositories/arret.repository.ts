import { PrismaClient } from '@prisma/client';
import { Arret } from '../types'; // Assuming you have a type definition for Arret

export class ArretRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async creerMultiple(trajetId: string, arrets: Arret[]): Promise<Arret[]> {
        return this.prisma.arret.createMany({
            data: arrets.map(arret => ({
                trajetId,
                nomArret: arret.nomArret,
                ville: arret.ville,
                coordonnees: arret.coordonnees,
                ordre: arret.ordre,
                heureArrivee: arret.heureArrivee,
                heureDepart: arret.heureDepart,
                dureeArret: arret.dureeArret,
            })),
        });
    }

    async lister(trajetId: string): Promise<Arret[]> {
        return this.prisma.arret.findMany({
            where: { trajetId },
        });
    }
}