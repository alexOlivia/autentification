import type { RoleUtilisateur } from '@prisma/client';

export interface JwtPayload {
  id: string;
  role: RoleUtilisateur;
  email?: string;
  telephone: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  requires2FA?: false;
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
    email?: string | null;
    telephone: string;
    role: RoleUtilisateur;
  };
}

export interface Login2FARequiredResult {
  requires2FA: true;
  utilisateurId: string;
  message: string;
}

export interface RegistrationResult {
  utilisateur: {
    id: string;
    telephone: string;
    statut: string;
  };
  message: string;
}

export interface SessionInfo {
  id: string;
  appareil: string | null;
  navigateur: string | null;
  systemeExploitation: string | null;
  adresseIP: string | null;
  localisation: string | null;
  dateDebut: Date;
  estActive: boolean;
}
