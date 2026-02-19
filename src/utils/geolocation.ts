import { redis } from '../config/redis.js';

const REDIS_GEO_PREFIX = 'geo:';
const GEO_CACHE_TTL = 24 * 60 * 60; // 24 heures

export interface GeoInfo {
  pays: string;
  ville: string;
  codePays: string;
}

const DEFAULT_GEO: GeoInfo = { pays: 'Inconnu', ville: 'Inconnu', codePays: '' };

const PRIVATE_IP_REGEX = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|::1|fc00:|fe80:)/;

export async function getGeoFromIP(ip: string): Promise<GeoInfo> {
  if (!ip || PRIVATE_IP_REGEX.test(ip)) {
    return { pays: 'Local', ville: 'Local', codePays: 'LO' };
  }

  // Vérifier le cache Redis
  const cached = await redis.get(`${REDIS_GEO_PREFIX}${ip}`);
  if (cached) {
    return JSON.parse(cached) as GeoInfo;
  }

  try {
    // API gratuite ip-api.com (45 req/min, suffisant pour un auth service)
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city,countryCode`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return DEFAULT_GEO;
    }

    const data = await response.json() as {
      status: string;
      country?: string;
      city?: string;
      countryCode?: string;
    };

    if (data.status !== 'success') {
      return DEFAULT_GEO;
    }

    const geo: GeoInfo = {
      pays: data.country ?? 'Inconnu',
      ville: data.city ?? 'Inconnu',
      codePays: data.countryCode ?? '',
    };

    // Mettre en cache dans Redis
    await redis.setex(`${REDIS_GEO_PREFIX}${ip}`, GEO_CACHE_TTL, JSON.stringify(geo));

    return geo;
  } catch {
    return DEFAULT_GEO;
  }
}

export function formatLocalisation(geo: GeoInfo): string {
  if (geo.pays === 'Local' || geo.pays === 'Inconnu') {
    return geo.pays;
  }
  return `${geo.ville}, ${geo.pays}`;
}

export async function isNewCountry(utilisateurId: string, currentCountryCode: string, prisma: any): Promise<boolean> {
  if (!currentCountryCode || currentCountryCode === 'LO') {
    return false;
  }

  // Chercher les sessions précédentes de l'utilisateur avec une localisation connue
  const previousSessions = await prisma.sessionUtilisateur.findMany({
    where: {
      utilisateurId,
      estActive: false,
      localisation: { not: null },
    },
    select: { localisation: true },
    orderBy: { dateDebut: 'desc' },
    take: 20,
  });

  if (previousSessions.length === 0) {
    // Première connexion, pas d'alerte
    return false;
  }

  // Vérifier si le pays actuel apparaît dans les sessions précédentes
  const knownLocations = previousSessions.map((s: { localisation: string | null }) => s.localisation ?? '');
  return !knownLocations.some((loc: string) => loc.includes(currentCountryCode) || loc === 'Local');
}
