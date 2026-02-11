import { FastifyRequest, FastifyReply } from 'fastify';
import { PlaceService } from '../services/place.service';
import { PlaceDTO } from '../dto/place.dto';
import { z } from 'zod';
import { validate } from '../validators/place.schema';

export class PlaceController {
    private placeService: PlaceService;

    constructor() {
        this.placeService = new PlaceService();
    }

    async creerPlaces(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const validatedData = validate(req.body);
            const places = await this.placeService.creerPlaces(validatedData.vehiculeId, validatedData.config);
            res.status(201).send(places);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async obtenirPlace(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const placeId = req.params.id;
            const place = await this.placeService.trouverParId(placeId);
            if (!place) {
                res.status(404).send({ error: 'Place non trouvée' });
                return;
            }
            res.send(place);
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async verifierDisponibilite(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const { placeId, trajetId } = req.params;
            const isAvailable = await this.placeService.verifierDisponibilite(placeId, trajetId);
            res.send({ disponible: isAvailable });
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }

    async bloquerPlace(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const { placeId, trajetId } = req.params;
            await this.placeService.bloquerPlace(placeId, trajetId);
            res.status(204).send();
        } catch (error) {
            res.status(400).send({ error: error.message });
        }
    }
}