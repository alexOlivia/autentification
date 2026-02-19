export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly isOperational = true,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class AuthenticationError extends AppError {
  constructor(code = 'IDENTIFIANTS_INVALIDES', message = 'Identifiants invalides') {
    super(401, code, message);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Accès non autorisé') {
    super(403, 'ACCES_NON_AUTORISE', message);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Données invalides', details?: unknown) {
    super(400, 'DONNEES_INVALIDES', message, true, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Ressource', message?: string) {
    super(404, 'RESSOURCE_NON_TROUVEE', message ?? `${resource} non trouvé(e)`);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Cette ressource existe déjà') {
    super(409, 'CONFLIT', message);
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Trop de tentatives, veuillez réessayer plus tard') {
    super(429, 'TROP_DE_TENTATIVES', message);
  }
}

export class InternalError extends AppError {
  constructor(message = 'Erreur interne du serveur') {
    super(500, 'ERREUR_INTERNE', message, false);
  }
}
