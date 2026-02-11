export class VehiculeDTO {
    id: string;
    commercantId: string;
    typeTransport: string;
    immatriculation: string;
    marque: string;
    modele: string;
    compagnie: string;
    capaciteTotale: number;
    annee: number;
    equipements: string[];
    estActif: boolean;
    urlPhoto: string;
    dateCreation: Date;

    constructor(data: Partial<VehiculeDTO>) {
        this.id = data.id || '';
        this.commercantId = data.commercantId || '';
        this.typeTransport = data.typeTransport || '';
        this.immatriculation = data.immatriculation || '';
        this.marque = data.marque || '';
        this.modele = data.modele || '';
        this.compagnie = data.compagnie || '';
        this.capaciteTotale = data.capaciteTotale || 0;
        this.annee = data.annee || 0;
        this.equipements = data.equipements || [];
        this.estActif = data.estActif || true;
        this.urlPhoto = data.urlPhoto || '';
        this.dateCreation = data.dateCreation || new Date();
    }
}