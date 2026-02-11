import { PrismaClient } from '@prisma/client';
import { Chauffeur } from '../types';
import { ChauffeurDTO } from '../dto/chauffeur.dto';

export class ChauffeurRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: ChauffeurDTO): Promise<Chauffeur> {
        return this.prisma.chauffeur.create({
            data,
        });
    }

    async findById(id: string): Promise<Chauffeur | null> {
        return this.prisma.chauffeur.findUnique({
            where: { id },
        });
    }

    async update(id: string, data: Partial<ChauffeurDTO>): Promise<Chauffeur> {
        return this.prisma.chauffeur.update({
            where: { id },
            data,
        });
    }

    async list(commercantId: string): Promise<Chauffeur[]> {
        return this.prisma.chauffeur.findMany({
            where: { commercantId },
        });
    }
}