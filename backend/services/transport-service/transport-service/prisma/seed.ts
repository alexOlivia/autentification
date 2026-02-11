import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Seed vehicles
    const vehicle1 = await prisma.vehicule.create({
        data: {
            commercantId: 'commercant1',
            typeTransport: 'BUS',
            immatriculation: 'ABC123',
            marque: 'Mercedes',
            modele: 'Sprinter',
            compagnie: 'Transport Co.',
            capaciteTotale: 20,
            annee: 2020,
            equipements: ['WiFi', 'AC'],
            estActif: true,
            urlPhoto: 'http://example.com/photo1.jpg',
            dateCreation: new Date(),
        },
    });

    const vehicle2 = await prisma.vehicule.create({
        data: {
            commercantId: 'commercant2',
            typeTransport: 'TRAIN',
            immatriculation: 'XYZ789',
            marque: 'Siemens',
            modele: 'ICE',
            compagnie: 'Railways Inc.',
            capaciteTotale: 200,
            annee: 2019,
            equipements: ['WiFi', 'Catering'],
            estActif: true,
            urlPhoto: 'http://example.com/photo2.jpg',
            dateCreation: new Date(),
        },
    });

    // Seed drivers
    const driver1 = await prisma.chauffeur.create({
        data: {
            commercantId: 'commercant1',
            prenom: 'John',
            nom: 'Doe',
            telephone: '1234567890',
            numeroPermis: 'PERMIT123',
            dateExpirationPermis: new Date('2025-12-31'),
            evaluation: 4.5,
            nombreVoyages: 50,
            estDisponible: true,
            urlPhoto: 'http://example.com/driver1.jpg',
            dateCreation: new Date(),
        },
    });

    const driver2 = await prisma.chauffeur.create({
        data: {
            commercantId: 'commercant2',
            prenom: 'Jane',
            nom: 'Smith',
            telephone: '0987654321',
            numeroPermis: 'PERMIT456',
            dateExpirationPermis: new Date('2024-11-30'),
            evaluation: 4.8,
            nombreVoyages: 75,
            estDisponible: true,
            urlPhoto: 'http://example.com/driver2.jpg',
            dateCreation: new Date(),
        },
    });

    // Seed lines
    const line1 = await prisma.ligne.create({
        data: {
            commercantId: 'commercant1',
            numero: '101',
            nom: 'Downtown to Uptown',
            typeTransport: 'BUS',
            description: 'Express bus service',
            tempsTrajetMoyen: 30,
            dateCreation: new Date(),
        },
    });

    const line2 = await prisma.ligne.create({
        data: {
            commercantId: 'commercant2',
            numero: '202',
            nom: 'City Center to Airport',
            typeTransport: 'TRAIN',
            description: 'Fast train service to the airport',
            tempsTrajetMoyen: 15,
            dateCreation: new Date(),
        },
    });

    console.log({ vehicle1, vehicle2, driver1, driver2, line1, line2 });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });