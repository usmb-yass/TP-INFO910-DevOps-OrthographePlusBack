import winston from 'winston';
import { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Variable pour contrôler l'affichage du contenu de la requête (req.body)
const LOG_REQUEST_BODY = true;
const thresholdMs = 10000; // délai en millisecondes de battement pour séparer les sessions

let lastLogTime = Date.now();

// Formateur sur-mesure
const customFormat = winston.format.printf(({ level, message, service, ...meta }) => {
    let output = '';
    const now = Date.now();
    
    // Ajout d'un saut de ligne si le délai est dépassé pour séparer les sessions
    if (now - lastLogTime > thresholdMs) {
        output += '\n';
    }
    lastLogTime = now;

    // Timestamp formaté en français
    const timestampStr = new Date().toLocaleString('fr-FR');

    const serviceTag = service ? ` [${service}]` : '';
    const prefix = `[${timestampStr}] [${level.toUpperCase()}]${serviceTag}`;

    // Application des couleurs : ERROR et WARN sont prioritaires sur le service
    if (level === 'error') {
        output += `\x1b[31m${prefix} ${message}\x1b[0m`; // Error -> Rouge
    } else if (level === 'warn') {
        output += `\x1b[35m${prefix} ${message}\x1b[0m`; // Warning -> Violet
    } else if (service === 'API' || service === 'API-REQUÊTE') {
        output += `\x1b[33m${prefix} ${message}\x1b[0m`; // API -> Jaune/Orange
    } else if (service === 'API-RÉPONSE') {
        output += `\x1b[32m${prefix} ${message}\x1b[0m`; // API-RÉPONSE -> Vert
    } else if (service === 'BDD') {
        output += `\x1b[34m${prefix} ${message}\x1b[0m`; // BDD -> Bleu
    } else {
        output += `${prefix} ${message}`;
    }

    return output;
});

// Création du logger Winston
export const logger = winston.createLogger({
    // Le niveau est défini par LOG_LEVEL (sinon, par défaut : 'info' en prod, 'debug' en dev)
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'development' ? 'debug' : 'info'),
    format: winston.format.combine(
        customFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export const setupLogs = (app: Application) => {
    // Log des requêtes API (info) et de leur body (debug)
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.originalUrl === '/health-check' || req.originalUrl === '/healthz') {
            return next();
        }

        logger.info(`${req.method} ${req.originalUrl}`, { service: 'API' });
        
        if (LOG_REQUEST_BODY && req.body && Object.keys(req.body).length > 0) {
            logger.debug(JSON.stringify(req.body, null, 2), { service: 'API-REQUÊTE' });
        }

        res.on('finish', () => {
            const level = res.statusCode >= 500 ? 'error' : (res.statusCode >= 400 ? 'warn' : 'info');
            logger.log(level, `${req.method} ${req.originalUrl} - Statut : ${res.statusCode}`, { service: 'API-RÉPONSE' });
        });

        next();
    });

    // Log des requêtes BDD (debug)
    mongoose.set('debug', function (collectionName: string, method: string, query: any, doc: any) {
        logger.debug(`${collectionName}.${method}(${JSON.stringify(query)})`, { service: 'BDD' });
    });
};
