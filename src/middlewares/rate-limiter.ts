import rateLimit from 'express-rate-limit';

// Limiteur général pour l'API
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limite chaque IP à 300 requêtes par `window` (ici, par 15 minutes)
    standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
    message: {
        error: 'Trop de requêtes depuis cette adresse IP, veuillez réessayer après 15 minutes.'
    }
});

// Limiteur strict pour les routes d'authentification (login, register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limite chaque IP à 10 requêtes par `window`
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Trop de tentatives depuis cette adresse IP, veuillez réessayer après 15 minutes.'
    }
});
