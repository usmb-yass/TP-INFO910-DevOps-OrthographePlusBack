import { HelmetOptions } from 'helmet';
import { CorsOptions } from 'cors';

export const helmetConfig: HelmetOptions = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            frameAncestors: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    dnsPrefetchControl: true,
    frameguard: { action: "deny" },
    hidePoweredBy: true,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    },
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: { policy: "no-referrer" },
    xssFilter: true
};

export const corsConfig: CorsOptions = {
    origin: process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.trim() !== ''
        ? process.env.CORS_ORIGIN.split(',')
        : true, // Fallback permissif pour le développement local
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Autoriser les cookies/credentials
};

