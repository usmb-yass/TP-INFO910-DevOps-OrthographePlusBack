import { Request, Response } from 'express';
import { userProgressesService } from '../services/user-progresses.service';

export const userProgressesController = {
    async getMyProgress(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const progress = await userProgressesService.getUserProgress(userId);
            res.status(200).json(progress);
        } catch (error: any) {
            console.error('Erreur lors de la récupération de la progression:', error);
            if (error.message.includes('not found') || error.message.includes('no grade level')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        }
    },

    async getMyCategories(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const categories = await userProgressesService.getMySeenCategories(userId);
            res.status(200).json(categories);
        } catch (error: any) {
            console.error('Erreur lors de la récupération des catégories vues:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    },

    async getMyRules(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const rules = await userProgressesService.getMySeenRules(userId);
            res.status(200).json(rules);
        } catch (error: any) {
            console.error('Erreur lors de la récupération des règles vues:', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        }
    }
};
