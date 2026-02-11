export type Vehicule = {
    id: string;
    commercantId: string;
    typeTransport: TypeTransport;
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
};

export type Trajet = {
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
};

export type Place = {
    id: string;
    vehiculeId: string;
    numero: string;
    classe: ClasseTransport;
    typeSiege: TypePlace;
    position: PositionPlace;
    prixBase: number;
    caracteristiques: string[];
    estDisponible: boolean;
};

export type Ligne = {
    id: string;
    commercantId: string;
    numero: string;
    nom: string;
    typeTransport: TypeTransport;
    description: string;
    tempsTrajetMoyen: number;
    dateCreation: Date;
};

export type Arret = {
    id: string;
    trajetId: string;
    nomArret: string;
    ville: string;
    coordonnees: Coordonnees;
    ordre: number;
    heureArrivee: Date;
    heureDepart: Date;
    dureeArret: number;
};

export type Chauffeur = {
    id: string;
    commercantId: string;
    prenom: string;
    nom: string;
    telephone: string;
    numeroPermis: string;
    dateExpirationPermis: Date;
    evaluation: number;
    nombreVoyages: number;
    estDisponible: boolean;
    urlPhoto: string;
    dateCreation: Date;
};

export enum TypeTransport {
    BUS,
    MINIBUS,
    TRAIN,
    AVION,
    METRO,
    VTC,
    TAXI,
    BATEAU,
}

export enum ClasseTransport {
    ECONOMIQUE,
    CONFORT,
    BUSINESS,
    PREMIERE,
    VIP,
}

export enum TypePlace {
    STANDARD,
    FENETRE,
    COULOIR,
    INCLINABLE,
    COUCHETTE,
}

export enum StatutTrajet {
    PROGRAMME,
    EMBARQUEMENT,
    EN_COURS,
    TERMINE,
    ANNULE,
    RETARDE,
}

export enum StatutBillet {
    RESERVE,
    PAYE,
    VALIDE,
    UTILISE,
    ANNULE,
    EXPIRE,
    REMBOURSE,
}

export enum TypeDocument {
    CNI,
    PASSEPORT,
    PERMIS_CONDUIRE,
    CARTE_RESIDENT,
}

export enum StatutCourse {
    DEMANDEE,
    ACCEPTEE,
    CHAUFFEUR_EN_ROUTE,
    ARRIVEE_DEPART,
    EN_COURS,
    TERMINEE,
    ANNULEE,
}

export enum PositionPlace {
    AVANT,
    MILIEU,
    ARRIERE,
    SUPERIEUR,
    INFERIEUR,
}

export class Coordonnees {
    latitude: number;
    longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    calculerDistance(autre: Coordonnees): number {
        // Implement distance calculation logic here
        return 0; // Placeholder
    }
}

export class ConfigPlaces {
    capacite: number;
    repartitionClasses: Map<ClasseTransport, number>;
    typesPlaces: TypePlace[];
    prixParClasse: Map<ClasseTransport, number>;

    constructor(capacite: number, repartitionClasses: Map<ClasseTransport, number>, typesPlaces: TypePlace[], prixParClasse: Map<ClasseTransport, number>) {
        this.capacite = capacite;
        this.repartitionClasses = repartitionClasses;
        this.typesPlaces = typesPlaces;
        this.prixParClasse = prixParClasse;
    }
}

export class CriteresRecherche {
    origine: string;
    destination: string;
    dateDepart: Date;
    nombrePassagers: number;
    classePreferee: ClasseTransport;
    typeTransport: TypeTransport;

    constructor(origine: string, destination: string, dateDepart: Date, nombrePassagers: number, classePreferee: ClasseTransport, typeTransport: TypeTransport) {
        this.origine = origine;
        this.destination = destination;
        this.dateDepart = dateDepart;
        this.nombrePassagers = nombrePassagers;
        this.classePreferee = classePreferee;
        this.typeTransport = typeTransport;
    }
}