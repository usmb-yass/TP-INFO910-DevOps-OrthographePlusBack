// Extension des types Express pour inclure l'utilisateur authentifié
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export {};
