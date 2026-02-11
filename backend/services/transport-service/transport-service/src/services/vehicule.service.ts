import { PrismaClient } from '@prisma/client';
import { VehiculeDTO } from '../dto/vehicule.dto';
import { Vehicule } from '../repositories/vehicule.repository';
import { ValidateurVehicule } from '../validators/vehicule.schema';

export class VehiculeService {
    private prisma: PrismaClient;
    private validateur: ValidateurVehicule;

    constructor() {
        this.prisma = new PrismaClient();
        this.validateur = new ValidateurVehicule();
    }

    async creer(commercantId: string, donnees: VehiculeDTO): Promise<Vehicule> {
        this.validateur.valider(donnees);
        const vehicule = await this.prisma.vehicule.create({
            data: {
                commercantId,
                ...donnees,
            },
        });
        return vehicule;
    }

    async trouverParId(id: string): Promise<Vehicule | null> {
        return await this.prisma.vehicule.findUnique({
            where: { id },
        });
    }

    async lister(commercantId: string, filtres: any): Promise<Vehicule[]> {
        return await this.prisma.vehicule.findMany({
            where: { commercantId, ...filtres },
        });
    }

    async mettreAJour(id: string, donnees: Partial<VehiculeDTO>): Promise<Vehicule> {
        this.validateur.valider(donnees);
        return await this.prisma.vehicule.update({
            where: { id },
            data: donnees,
        });
    }

    async supprimer(id: string): Promise<void> {
        await this.prisma.vehicule.delete({
            where: { id },
        });
    }
}