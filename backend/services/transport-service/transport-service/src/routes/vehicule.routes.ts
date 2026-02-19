import { FastifyInstance } from 'fastify';
import { VehiculeController } from '../controllers/vehicule.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateVehicule } from '../validators/vehicule.schema';

export const vehiculeRoutes = async (app: FastifyInstance) => {
    const controller = new VehiculeController();

    app.post('/vehicules', { preHandler: authMiddleware, schema: validateVehicule }, controller.creerVehicule.bind(controller));
    app.get('/vehicules/:id', { preHandler: authMiddleware }, controller.obtenirVehicule.bind(controller));
    app.put('/vehicules/:id', { preHandler: authMiddleware, schema: validateVehicule }, controller.mettreAJourVehicule.bind(controller));
    app.delete('/vehicules/:id', { preHandler: authMiddleware }, controller.supprimerVehicule.bind(controller));
    app.get('/vehicules', { preHandler: authMiddleware }, controller.listerVehicules.bind(controller));
};