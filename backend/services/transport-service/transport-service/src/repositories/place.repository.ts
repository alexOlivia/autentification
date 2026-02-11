import { PrismaClient } from '@prisma/client';
import { PlaceDTO } from '../dto/place.dto';

export class PlaceRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(data: PlaceDTO) {
        return await this.prisma.place.create({
            data,
        });
    }

    async findById(id: string) {
        return await this.prisma.place.findUnique({
            where: { id },
        });
    }

    async list(vehiculeId: string) {
        return await this.prisma.place.findMany({
            where: { vehiculeId },
        });
    }

    async update(id: string, data: Partial<PlaceDTO>) {
        return await this.prisma.place.update({
            where: { id },
            data,
        });
    }

    async delete(id: string) {
        return await this.prisma.place.delete({
            where: { id },
        });
    }
}