import { FastifyRequest, FastifyReply } from 'fastify';
import { TrajetService } from '../services/trajet.service';
import { TrajetDTO } from '../dto/trajet.dto';
import { z } from 'zod';
import { trajetSchema } from '../validators/trajet.schema';

export class TrajetController {
    private trajetService: TrajetService;

    constructor() {
        this.trajetService = new TrajetService();
    }

    async creerTrajet(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const parsedData = trajetSchema.parse(req.body);
        const trajet = await this.trajetService.creer(parsedData);
        res.status(201).send(trajet);
    }

    async obtenirTrajet(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: string };
        const trajet = await this.trajetService.trouverParId(id);
        if (!trajet) {
            res.status(404).send({ message: 'Trajet non trouvé' });
            return;
        }
        res.send(trajet);
    }

    async listerTrajets(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const trajets = await this.trajetService.lister();
        res.send(trajets);
    }

    async rechercherTrajets(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { origine, destination, date } = req.query as { origine: string; destination: string; date: string };
        const trajets = await this.trajetService.rechercher(origine, destination, new Date(date));
        res.send(trajets);
    }
}