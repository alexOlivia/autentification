import { PrismaClient } from '@prisma/client';
import { TrajetDTO } from '../dto/trajet.dto';

export class TrajetRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async creer(donnees: TrajetDTO) {
        return await this.prisma.trajet.create({
            data: {
                vehiculeId: donnees.vehiculeId,
                ligneId: donnees.ligneId,
                origine: donnees.origine,
                destination: donnees.destination,
                heureDepart: donnees.heureDepart,
                heureArrivee: donnees.heureArrivee,
                dureeEstimee: donnees.dureeEstimee,
                distance: donnees.distance,
                statut: donnees.statut,
                chauffeurId: donnees.chauffeurId,
            },
        });
    }

    async trouverParId(id: string) {
        return await this.prisma.trajet.findUnique({
            where: { id },
        });
    }

    async rechercher(criteres: any) {
        return await this.prisma.trajet.findMany({
            where: {
                origine: criteres.origine,
                destination: criteres.destination,
                heureDepart: {
                    gte: criteres.dateDepart,
                },
            },
        });
    }

    async lister(vehiculeId: string, date: Date) {
        return await this.prisma.trajet.findMany({
            where: {
                vehiculeId,
                heureDepart: {
                    gte: date,
                },
            },
        });
    }
}