import { PrismaClient } from '@prisma/client';
import { VehiculeDTO } from '../dto/vehicule.dto';

export class VehiculeRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async creer(donnees: VehiculeDTO) {
        return await this.prisma.vehicule.create({
            data: {
                commercantId: donnees.commercantId,
                typeTransport: donnees.typeTransport,
                immatriculation: donnees.immatriculation,
                marque: donnees.marque,
                modele: donnees.modele,
                compagnie: donnees.compagnie,
                capaciteTotale: donnees.capaciteTotale,
                annee: donnees.annee,
                equipements: donnees.equipements,
                estActif: donnees.estActif,
                urlPhoto: donnees.urlPhoto,
                dateCreation: new Date(),
            },
        });
    }

    async trouverParId(id: string) {
        return await this.prisma.vehicule.findUnique({
            where: { id },
        });
    }

    async lister(commercantId: string, filtres: any) {
        return await this.prisma.vehicule.findMany({
            where: {
                commercantId,
                ...filtres,
            },
        });
    }

    async mettreAJour(id: string, donnees: Partial<VehiculeDTO>) {
        return await this.prisma.vehicule.update({
            where: { id },
            data: donnees,
        });
    }

    async supprimer(id: string) {
        return await this.prisma.vehicule.delete({
            where: { id },
        });
    }
}