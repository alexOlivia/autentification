import axios, { AxiosInstance } from 'axios';

class ResourceCoreClient {
    private client: AxiosInstance;
    private urlBase: string;

    constructor() {
        this.urlBase = process.env.RESOURCE_CORE_URL || 'http://localhost:3000'; // Default URL
        this.client = axios.create({
            baseURL: this.urlBase,
            timeout: 5000,
        });
    }

    async validerRessource(donnees: any): Promise<any> {
        try {
            const response = await this.client.post('/validate', donnees);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de la validation de la ressource: ${error.message}`);
        }
    }

    async obtenirCommercant(id: string): Promise<any> {
        try {
            const response = await this.client.get(`/commercants/${id}`);
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de l'obtention du commerçant: ${error.message}`);
        }
    }
}

export default new ResourceCoreClient();