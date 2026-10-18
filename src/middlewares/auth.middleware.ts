import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/Users';

export interface AuthenticatedRequest extends Request {
    user?: any;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Non autorisé. Token manquant ou invalide.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
        res.status(500).json({ error: 'Erreur de configuration serveur.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }; // car AuthService.generateToken retourne { id: userId }
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Non autorisé. Token invalide ou expiré.' });
        return;
    }
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Non autorisé. Token manquant ou invalide.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
        res.status(500).json({ error: 'Erreur de configuration serveur.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id?: string };

        if (!decoded.id) {
            res.status(401).json({ error: 'Non autorisé. Token invalide ou expiré.' });
            return;
        }

        const user = await UserModel.findById(decoded.id).select('role email firstName lastName');

        if (!user) {
            res.status(401).json({ error: 'Non autorisé. Utilisateur introuvable.' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ error: 'Accès interdit. Administrateur requis.' });
            return;
        }

        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        next();
    } catch (err) {
        res.status(401).json({ error: 'Non autorisé. Token invalide ou expiré.' });
        return;
    }
};

export const requireSchoolAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Non autorisé. Token manquant ou invalide.' });
        return;
    }

    const token = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET n\'est pas défini dans les variables d\'environnement.');
        res.status(500).json({ error: 'Erreur de configuration serveur.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id?: string };

        if (!decoded.id) {
            res.status(401).json({ error: 'Non autorisé. Token invalide ou expiré.' });
            return;
        }

        const user = await UserModel.findById(decoded.id).select('role email firstName lastName schoolId');

        if (!user) {
            res.status(401).json({ error: 'Non autorisé. Utilisateur introuvable.' });
            return;
        }

        if (user.role !== 'school_admin') {
            res.status(403).json({ error: 'Accès interdit. Administrateur école requis.' });
            return;
        }

        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            schoolId: user.schoolId?.toString()
        };

        next();
    } catch (err) {
        res.status(401).json({ error: 'Non autorisé. Token invalide ou expiré.' });
        return;
    }
};
