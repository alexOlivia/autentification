import { FastifyRequest, FastifyReply } from 'fastify';
import { LigneService } from '../services/ligne.service';
import { LigneDTO } from '../dto/ligne.dto';
import { z } from 'zod';

export class LigneController {
    private ligneService: LigneService;

    constructor() {
        this.ligneService = new LigneService();
    }

    async creerLigne(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const ligneSchema = z.object({
            commercantId: z.string(),
            numero: z.string(),
            nom: z.string(),
            typeTransport: z.enum(['BUS', 'MINIBUS', 'TRAIN', 'AVION', 'METRO', 'VTC', 'TAXI', 'BATEAU']),
            description: z.string().optional(),
            tempsTrajetMoyen: z.number(),
        });

        try {
            const ligneData = ligneSchema.parse(req.body);
            const ligne = await this.ligneService.creer(ligneData);
            res.status(201).send(ligne);
        } catch (error) {
            res.status(400).send({ error: error.errors });
        }
    }

    async obtenirLigne(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: string };
        const ligne = await this.ligneService.trouverParId(id);
        if (ligne) {
            res.send(ligne);
        } else {
            res.status(404).send({ message: 'Ligne non trouvée' });
        }
    }

    async listerLignes(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const lignes = await this.ligneService.lister();
        res.send(lignes);
    }
}