import { Chauffeur } from '../repositories/chauffeur.repository';
import { ValidateurChauffeur } from '../validators/chauffeur.schema';
import { PrismaClient } from '@prisma/client';

export class ChauffeurService {
    private db: PrismaClient;
    private validateur: ValidateurChauffeur;

    constructor() {
        this.db = new PrismaClient();
        this.validateur = new ValidateurChauffeur();
    }

    async ajouter(commercantId: string, donnees: any): Promise<Chauffeur> {
        const validationResult = this.validateur.valider(donnees);
        if (!validationResult.success) {
            throw new Error('Validation failed');
        }
        return await this.db.chauffeur.create({
            data: {
                ...donnees,
                commercantId,
            },
        });
    }

    async trouverParId(id: string): Promise<Chauffeur | null> {
        return await this.db.chauffeur.findUnique({
            where: { id },
        });
    }

    async mettreAJour(id: string, donnees: any): Promise<Chauffeur> {
        const validationResult = this.validateur.valider(donnees);
        if (!validationResult.success) {
            throw new Error('Validation failed');
        }
        return await this.db.chauffeur.update({
            where: { id },
            data: donnees,
        });
    }

    async lister(commercantId: string): Promise<Chauffeur[]> {
        return await this.db.chauffeur.findMany({
            where: { commercantId },
        });
    }

    async verifierDisponibilite(chauffeurId: string, dateHeure: Date): Promise<boolean> {
        const chauffeur = await this.trouverParId(chauffeurId);
        return chauffeur ? chauffeur.estDisponible : false;
    }
}