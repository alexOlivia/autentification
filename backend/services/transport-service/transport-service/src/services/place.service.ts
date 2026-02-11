import { Place } from '../repositories/place.repository';
import { ConfigPlaces } from '../dto/place.dto';
import { ServiceDisponibilite } from './disponibilite.service';
import { DepotPlace } from '../repositories/place.repository';
import { GestionnaireCache } from '../cache/availability.cache';

export class PlaceService {
    private depotPlace: DepotPlace;
    private serviceDisponibilite: ServiceDisponibilite;
    private cache: GestionnaireCache;

    constructor(depotPlace: DepotPlace, serviceDisponibilite: ServiceDisponibilite, cache: GestionnaireCache) {
        this.depotPlace = depotPlace;
        this.serviceDisponibilite = serviceDisponibilite;
        this.cache = cache;
    }

    async creerPlaces(vehiculeId: string, config: ConfigPlaces): Promise<Place[]> {
        const places = await this.depotPlace.creerMultiple(config);
        return places;
    }

    async trouverParId(id: string): Promise<Place | null> {
        return await this.depotPlace.trouverParId(id);
    }

    async lister(vehiculeId: string): Promise<Place[]> {
        return await this.depotPlace.lister(vehiculeId);
    }

    async genererNumerotation(typeVehicule: string, capacite: number): Promise<string[]> {
        // Logic to generate numbering based on vehicle type and capacity
        return [];
    }
}