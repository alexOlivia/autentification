import { FastifyRequest, FastifyReply } from 'fastify';
import { VehiculeService } from '../services/vehicule.service';
import { VehiculeDTO } from '../dto/vehicule.dto';
import { z } from 'zod';
import { validate } from '../validators/vehicule.schema';

export class VehiculeController {
    private vehiculeService: VehiculeService;

    constructor() {
        this.vehiculeService = new VehiculeService();
    }

    async creerVehicule(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const validatedData = validate(req.body);
            const vehicule = await this.vehiculeService.creer(validatedData);
            res.status(201).send(vehicule);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async obtenirVehicule(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const vehicule = await this.vehiculeService.trouverParId(id);
            if (!vehicule) {
                res.status(404).send({ error: 'Véhicule non trouvé' });
                return;
            }
            res.send(vehicule);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async mettreAJourVehicule(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            const validatedData = validate(req.body);
            const vehicule = await this.vehiculeService.mettreAJour(id, validatedData);
            if (!vehicule) {
                res.status(404).send({ error: 'Véhicule non trouvé' });
                return;
            }
            res.send(vehicule);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async supprimerVehicule(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const { id } = req.params as { id: string };
            await this.vehiculeService.supprimer(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async listerVehicules(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const vehicules = await this.vehiculeService.lister(req.query);
            res.send(vehicules);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}