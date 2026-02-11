import { Coordonnees } from '../types';
import { Arret } from '../repositories/arret.repository';

export class CalculateurItineraire {
    public static calculerDistance(origine: Coordonnees, destination: Coordonnees): number {
        const R = 6371; // Rayon de la Terre en kilomètres
        const dLat = this.degresEnRadians(destination.latitude - origine.latitude);
        const dLon = this.degresEnRadians(destination.longitude - origine.longitude);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degresEnRadians(origine.latitude)) * Math.cos(this.degresEnRadians(destination.latitude)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance en kilomètres
    }

    public static calculerDuree(distance: number, vitesseMoyenne: number): number {
        return distance / vitesseMoyenne; // Durée en heures
    }

    public static calculerHeureArrivee(heureDepart: Date, duree: number): Date {
        const heureArrivee = new Date(heureDepart);
        heureArrivee.setHours(heureArrivee.getHours() + duree);
        return heureArrivee;
    }

    public static optimiserArrets(arrets: Arret[]): Arret[] {
        // Implémentation d'un algorithme d'optimisation des arrêts
        return arrets.sort((a, b) => a.ordre - b.ordre); // Exemple simple de tri par ordre
    }

    private static degresEnRadians(degres: number): number {
        return degres * (Math.PI / 180);
    }
}