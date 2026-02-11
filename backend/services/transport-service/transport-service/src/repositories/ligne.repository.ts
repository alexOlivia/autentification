import { PrismaClient } from '@prisma/client';
import { Ligne } from '../types'; // Adjust the import based on your types definition

export class LigneRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async creer(donnees: Ligne): Promise<Ligne> {
        return this.prisma.ligne.create({
            data: donnees,
        });
    }

    async trouverParId(id: string): Promise<Ligne | null> {
        return this.prisma.ligne.findUnique({
            where: { id },
        });
    }

    async lister(typeTransport: string): Promise<Ligne[]> {
        return this.prisma.ligne.findMany({
            where: { typeTransport },
        });
    }
}