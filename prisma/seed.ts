import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Créer les permissions par défaut
  const permissions = [
    // CONSULTATION
    { categorie: 'CONSULTATION' as const, ressource: 'utilisateurs', action: 'read', description: 'Consulter les utilisateurs' },
    { categorie: 'CONSULTATION' as const, ressource: 'reservations', action: 'read', description: 'Consulter les réservations' },
    { categorie: 'CONSULTATION' as const, ressource: 'ressources', action: 'read', description: 'Consulter les ressources' },
    { categorie: 'CONSULTATION' as const, ressource: 'paiements', action: 'read', description: 'Consulter les paiements' },

    // GESTION_RESERVATIONS
    { categorie: 'GESTION_RESERVATIONS' as const, ressource: 'reservations', action: 'create', description: 'Créer une réservation' },
    { categorie: 'GESTION_RESERVATIONS' as const, ressource: 'reservations', action: 'update', description: 'Modifier une réservation' },
    { categorie: 'GESTION_RESERVATIONS' as const, ressource: 'reservations', action: 'delete', description: 'Annuler une réservation' },

    // GESTION_RESSOURCES
    { categorie: 'GESTION_RESSOURCES' as const, ressource: 'ressources', action: 'create', description: 'Créer une ressource' },
    { categorie: 'GESTION_RESSOURCES' as const, ressource: 'ressources', action: 'update', description: 'Modifier une ressource' },
    { categorie: 'GESTION_RESSOURCES' as const, ressource: 'ressources', action: 'delete', description: 'Supprimer une ressource' },

    // GESTION_PAIEMENTS
    { categorie: 'GESTION_PAIEMENTS' as const, ressource: 'paiements', action: 'create', description: 'Créer un paiement' },
    { categorie: 'GESTION_PAIEMENTS' as const, ressource: 'paiements', action: 'refund', description: 'Rembourser un paiement' },

    // GESTION_UTILISATEURS
    { categorie: 'GESTION_UTILISATEURS' as const, ressource: 'utilisateurs', action: 'create', description: 'Créer un utilisateur' },
    { categorie: 'GESTION_UTILISATEURS' as const, ressource: 'utilisateurs', action: 'update', description: 'Modifier un utilisateur' },
    { categorie: 'GESTION_UTILISATEURS' as const, ressource: 'utilisateurs', action: 'delete', description: 'Supprimer un utilisateur' },
    { categorie: 'GESTION_UTILISATEURS' as const, ressource: 'utilisateurs', action: 'suspend', description: 'Suspendre un utilisateur' },

    // ADMINISTRATION_SYSTEME
    { categorie: 'ADMINISTRATION_SYSTEME' as const, ressource: 'systeme', action: 'configure', description: 'Configurer le système' },
    { categorie: 'ADMINISTRATION_SYSTEME' as const, ressource: 'permissions', action: 'manage', description: 'Gérer les permissions' },
  ];

  const createdPermissions = [];
  for (const perm of permissions) {
    const created = await prisma.permission.upsert({
      where: { ressource_action: { ressource: perm.ressource, action: perm.action } },
      update: {},
      create: perm,
    });
    createdPermissions.push(created);
  }
  console.log(`${createdPermissions.length} permissions créées/vérifiées`);

  // Assigner les permissions aux rôles
  const rolePermissions: Record<string, string[]> = {
    CLIENT: ['utilisateurs:read', 'reservations:read', 'reservations:create', 'ressources:read'],
    COMMERCANT: [
      'utilisateurs:read', 'reservations:read', 'reservations:create', 'reservations:update',
      'ressources:read', 'ressources:create', 'ressources:update', 'ressources:delete',
      'paiements:read',
    ],
    ADMIN: [
      'utilisateurs:read', 'utilisateurs:update', 'utilisateurs:suspend',
      'reservations:read', 'reservations:update', 'reservations:delete',
      'ressources:read', 'paiements:read', 'paiements:refund',
    ],
  };

  for (const [role, permKeys] of Object.entries(rolePermissions)) {
    for (const key of permKeys) {
      const [ressource, action] = key.split(':') as [string, string];
      const perm = createdPermissions.find((p) => p.ressource === ressource && p.action === action);
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { role_permissionId: { role: role as any, permissionId: perm.id } },
          update: {},
          create: { role: role as any, permissionId: perm.id },
        });
      }
    }
  }

  // SUPER_ADMIN a toutes les permissions
  for (const perm of createdPermissions) {
    await prisma.rolePermission.upsert({
      where: { role_permissionId: { role: 'SUPER_ADMIN', permissionId: perm.id } },
      update: {},
      create: { role: 'SUPER_ADMIN', permissionId: perm.id },
    });
  }
  console.log('Permissions assignées aux rôles');

  // Créer un SUPER_ADMIN par défaut
  const hashedPassword = await bcrypt.hash('SuperAdmin@2024!', 12);
  await prisma.utilisateur.upsert({
    where: { telephone: '+22500000000' },
    update: {},
    create: {
      telephone: '+22500000000',
      email: 'admin@authservice.local',
      motDePasse: hashedPassword,
      prenom: 'Super',
      nom: 'Admin',
      role: 'SUPER_ADMIN',
      statut: 'ACTIF',
      emailVerifie: true,
      telephoneVerifie: true,
    },
  });
  console.log('SUPER_ADMIN créé (tel: +22500000000, mdp: SuperAdmin@2024!)');

  console.log('Seeding terminé.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
