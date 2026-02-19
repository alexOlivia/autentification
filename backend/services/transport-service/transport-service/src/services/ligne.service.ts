import { Ligne } from '../repositories/ligne.repository';
import { PrismaClient } from '@prisma/client';

export class LigneService {
    private ligneRepository: Ligne;
    private db: PrismaClient;

    constructor() {
        this.db = new PrismaClient();
        this.ligneRepository = new Ligne(this.db);
    }

    async creer(commercantId: string, donnees: any): Promise<any> {
        return await this.ligneRepository.creer({ ...donnees, commercantId });
    }

    async trouverParId(id: string): Promise<any> {
        return await this.ligneRepository.trouverParId(id);
    }

    async lister(typeTransport: string): Promise<any[]> {
        return await this.ligneRepository.lister(typeTransport);
    }
}