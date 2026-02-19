export class PlaceDTO {
    id: string;
    vehiculeId: string;
    numero: string;
    classe: string; // ClasseTransport
    typeSiege: string; // TypePlace
    position: string; // PositionPlace
    prixBase: number;
    caracteristiques: string[];
    estDisponible: boolean;

    constructor(data: Partial<PlaceDTO>) {
        this.id = data.id || '';
        this.vehiculeId = data.vehiculeId || '';
        this.numero = data.numero || '';
        this.classe = data.classe || '';
        this.typeSiege = data.typeSiege || '';
        this.position = data.position || '';
        this.prixBase = data.prixBase || 0;
        this.caracteristiques = data.caracteristiques || [];
        this.estDisponible = data.estDisponible || true;
    }
}