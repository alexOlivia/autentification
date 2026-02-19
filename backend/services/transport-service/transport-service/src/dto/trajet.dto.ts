export class TrajetDTO {
    id: string;
    vehiculeId: string;
    ligneId: string;
    origine: string;
    destination: string;
    heureDepart: Date;
    heureArrivee: Date;
    dureeEstimee: number;
    distance: number;
    statut: StatutTrajet;
    chauffeurId: string;
    dateCreation: Date;

    constructor(data: Partial<TrajetDTO>) {
        this.id = data.id || '';
        this.vehiculeId = data.vehiculeId || '';
        this.ligneId = data.ligneId || '';
        this.origine = data.origine || '';
        this.destination = data.destination || '';
        this.heureDepart = data.heureDepart || new Date();
        this.heureArrivee = data.heureArrivee || new Date();
        this.dureeEstimee = data.dureeEstimee || 0;
        this.distance = data.distance || 0;
        this.statut = data.statut || StatutTrajet.PROGRAMME;
        this.chauffeurId = data.chauffeurId || '';
        this.dateCreation = data.dateCreation || new Date();
    }
}