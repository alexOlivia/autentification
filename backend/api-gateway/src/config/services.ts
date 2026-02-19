import { env } from './env';
import { UserRole } from '../middleware/auth';

export interface ServiceConfig {
  name: string;
  url: string;
  prefix: string;
  requireAuth: boolean;
  allowedRoles?: UserRole[]; // Rôles spécifiques par service
}

export const SERVICES: Record<string, ServiceConfig> = {
  auth: {
    name: 'Auth Service',
    url: env.AUTH_SERVICE_URL,
    prefix: '/api/auth',
    requireAuth: false,
  },
  booking: {
    name: 'Booking Service',
    url: env.BOOKING_SERVICE_URL,
    prefix: '/api/bookings',
    requireAuth: true,
    allowedRoles: [UserRole.CLIENT, UserRole.COMMERCANT, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  accommodation: {
    name: 'Accommodation Service',
    url: env.ACCOMMODATION_SERVICE_URL,
    prefix: '/api/accommodations',
    requireAuth: false,
    allowedRoles: [UserRole.CLIENT, UserRole.COMMERCANT, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  restaurant: {
    name: 'Restaurant Service',
    url: env.RESTAURANT_SERVICE_URL,
    prefix: '/api/restaurants',
    requireAuth: false,
  },
  transport: {
    name: 'Transport Service',
    url: env.TRANSPORT_SERVICE_URL,
    prefix: '/api/transports',
    requireAuth: false,
  },
  payment: {
    name: 'Payment Service',
    url: env.PAYMENT_SERVICE_URL,
    prefix: '/api/payments',
    requireAuth: true,
    allowedRoles: [UserRole.CLIENT, UserRole.COMMERCANT],
  },
  notification: {
    name: 'Notification Service',
    url: env.NOTIFICATION_SERVICE_URL,
    prefix: '/api/notifications',
    requireAuth: true,
  },
  serviceProvider: {
    name: 'Service Provider',
    url: env.SERVICE_PROVIDER_URL,
    prefix: '/api/providers',
    requireAuth: true,
    allowedRoles: [UserRole.COMMERCANT, UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
  resourceCore: {
    name: 'Resource Core Service',
    url: env.RESOURCE_CORE_URL,
    prefix: '/api/resources',
    requireAuth: false,
  },
  admin: {
    name: 'Admin Service',
    url: env.AUTH_SERVICE_URL, // Utilise le même service que auth pour l'instant
    prefix: '/api/admin',
    requireAuth: true,
    allowedRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
  },
};

// Routes publiques (pas d'authentification requise)
export const PUBLIC_ROUTES = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/refresh',
  '/api/auth/verify',
  '/health',
  '/docs',
  '/docs/json',
  '/api/accommodations', // GET seulement
  '/api/restaurants',    // GET seulement
  '/api/transports',     // GET seulement
];

// Routes avec accès restreint par rôle
export const ROLE_RESTRICTED_ROUTES = [
  { path: '/api/admin', roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
  { path: '/api/providers/manage', roles: [UserRole.COMMERCANT, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
  { path: '/api/bookings/manage', roles: [UserRole.COMMERCANT, UserRole.ADMIN, UserRole.SUPER_ADMIN] },
  { path: '/api/reports', roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
];