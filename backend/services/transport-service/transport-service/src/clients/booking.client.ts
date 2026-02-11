import axios, { AxiosInstance } from 'axios';

class BookingClient {
    private client: AxiosInstance;
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:3001'; // Default URL
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 5000,
        });
    }

    public async obtenirReservations(placeId: string, trajetId: string): Promise<any> {
        try {
            const response = await this.client.get(`/reservations`, {
                params: { placeId, trajetId },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Erreur lors de l'obtention des réservations: ${error.message}`);
        }
    }
}

export default new BookingClient();