import { Request, Response } from 'express';
import { statsService } from '../services/stats.service';

export const statsController = {
    async getMyStats(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const stats = await statsService.getMyStats(userId);
            res.status(200).json(stats);
        } catch (error: any) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            if (error.message.includes('not found')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        }
    }
};
