import { FastifyRequest, FastifyReply } from 'fastify';
import { ChauffeurService } from '../services/chauffeur.service';
import { ChauffeurDTO } from '../dto/chauffeur.dto';
import { z } from 'zod';

export class ChauffeurController {
    private chauffeurService: ChauffeurService;

    constructor(chauffeurService: ChauffeurService) {
        this.chauffeurService = chauffeurService;
    }

    public async ajouterChauffeur(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const chauffeurSchema = z.object({
            prenom: z.string().min(1),
            nom: z.string().min(1),
            telephone: z.string().min(10),
            numeroPermis: z.string().min(1),
            dateExpirationPermis: z.date(),
        });

        try {
            const chauffeurData = chauffeurSchema.parse(req.body);
            const chauffeur = await this.chauffeurService.ajouter(chauffeurData);
            res.status(201).send(chauffeur);
        } catch (error) {
            res.status(400).send({ error: error.errors });
        }
    }

    public async obtenirChauffeur(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: string };
        const chauffeur = await this.chauffeurService.trouverParId(id);
        if (chauffeur) {
            res.send(chauffeur);
        } else {
            res.status(404).send({ message: 'Chauffeur non trouvé' });
        }
    }

    public async mettreAJourDisponibilite(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const { id } = req.params as { id: string };
        const { estDisponible } = req.body;

        try {
            const chauffeur = await this.chauffeurService.mettreAJourDisponibilite(id, estDisponible);
            res.send(chauffeur);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    public async listerChauffeurs(req: FastifyRequest, res: FastifyReply): Promise<void> {
        const chauffeurs = await this.chauffeurService.lister();
        res.send(chauffeurs);
    }
}