import { PrismaClient } from '@prisma/client';
import { TrajetDTO } from '../dto/trajet.dto';
import { TrajetRepository } from '../repositories/trajet.repository';
import { CriteresRecherche } from '../dto/trajet.dto';

export class TrajetService {
    private trajetRepository: TrajetRepository;

    constructor(private prisma: PrismaClient) {
        this.trajetRepository = new TrajetRepository(prisma);
    }

    async creer(vehiculeId: string, ligneId: string, donnees: TrajetDTO) {
        return await this.trajetRepository.creer({
            ...donnees,
            vehiculeId,
            ligneId,
        });
    }

    async trouverParId(id: string) {
        return await this.trajetRepository.trouverParId(id);
    }

    async rechercher(origine: string, destination: string, date: Date) {
        const criteres: CriteresRecherche = { origine, destination, dateDepart: date, nombrePassagers: 1, classePreferee: null, typeTransport: null };
        return await this.trajetRepository.rechercher(criteres);
    }

    async lister(vehiculeId: string, date: Date) {
        return await this.trajetRepository.lister(vehiculeId, date);
    }

    async calculerDuree(arrets: any[]) {
        // Implement logic to calculate duration based on stops
        return arrets.reduce((total, arret) => total + arret.dureeArret, 0);
    }
}