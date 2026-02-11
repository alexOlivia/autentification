import { FastifyInstance } from 'fastify';
import { TrajetController } from '../controllers/trajet.controller';
import { trajetSchema } from '../validators/trajet.schema';
import { validate } from '../middlewares/auth.middleware';

export const trajetRoutes = async (app: FastifyInstance) => {
    const trajetController = new TrajetController();

    app.post('/trajets', { schema: trajetSchema }, trajetController.creerTrajet.bind(trajetController));
    app.get('/trajets/:id', trajetController.obtenirTrajet.bind(trajetController));
    app.get('/trajets', trajetController.listerTrajets.bind(trajetController));
    app.get('/trajets/recherche', trajetController.rechercherTrajets.bind(trajetController));
};