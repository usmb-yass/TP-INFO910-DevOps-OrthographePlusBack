import { Request, Response } from 'express';
import { learningSessionsService } from '../services/learning-sessions.service';
import { startSessionSchema } from '#shared/schemas/LearningSession/StartSessionSchema';
import { submitAnswerSchema } from '#shared/schemas/LearningSession/SubmitAnswerSchema';

export const learningSessionsController = {
    async startSession(req: Request, res: Response): Promise<void> {
        try {
            const parsed = startSessionSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            const session = await learningSessionsService.startSession(userId, parsed.data);
            res.status(201).json(session);
        } catch (error: any) {
            console.error('Erreur lors du démarrage de la session:', error);
            if (error.message === 'TRAINING_ALREADY_EXISTS' || error.code === 11000) {
                res.status(409).json({ error: "Une session d'entraînement est déjà en cours." });
            } else if (error.message === 'TRAINING_NOT_FOUND') {
                res.status(404).json({ error: "Aucun entraînement en cours n'a été trouvé." });
            } else if (error.message === 'UNSEEN_CATEGORIES') {
                res.status(403).json({ error: "Vous ne pouvez vous entraîner que sur des catégories déjà vues." });
            } else if (error.message.includes('introuvable') || error.message.includes('impossible')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        }
    },

    async submitAnswer(req: Request, res: Response): Promise<void> {
        try {
            const sessionId = String(req.params.id);
            const parsed = submitAnswerSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const result = await learningSessionsService.submitAnswer(sessionId, parsed.data.questionId, parsed.data.userAnswer, parsed.data.duration);
            res.status(200).json(result);
        } catch (error: any) {
            console.error('Erreur lors de la soumission de la réponse:', error);
            if (error.message.includes('introuvable')) {
                res.status(404).json({ error: error.message });
            } else if (error.message.includes('ne correspond pas') || error.message.includes('plus en cours')) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        }
    },

    async finishSession(req: Request, res: Response): Promise<void> {
        try {
            const sessionId = String(req.params.id);
            const session = await learningSessionsService.finishSession(sessionId);
            res.status(200).json(session);
        } catch (error: any) {
            console.error('Erreur lors de la clôture de la session:', error);
            if (error.message.includes('introuvable')) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        }
    },

    async deleteCurrentTraining(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(401).json({ error: 'Non autorisé' });
                return;
            }

            await learningSessionsService.deleteCurrentTraining(userId);
            res.status(200).json({ message: "Entraînement supprimé avec succès." });
        } catch (error: any) {
            console.error("Erreur lors de la suppression de l'entraînement:", error);
            if (error.message.includes("trouvé")) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur interne du serveur' });
            }
        }
    }
};
