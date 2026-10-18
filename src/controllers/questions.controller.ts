import { Request, Response } from 'express';
import { questionsService } from '../services/questions.service';
import { questionSchema } from '../schemas/Question/QuestionSchema';
import { updateQuestionSchema } from '../schemas/Question/UpdateQuestionSchema';

export const questionsController = {
    // Créer une nouvelle question
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = questionSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const newQuestion = await questionsService.createQuestion(parsed.data);
            res.status(201).json({ message: 'Question créée avec succès', question: newQuestion });
        } catch (error) {
            console.error('Erreur lors de la création de la question:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Uploader un fichier audio
    async uploadAudio(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'Aucun fichier fourni' });
                return;
            }
            res.status(200).json({ filename: req.file.filename });
        } catch (error) {
            console.error('Erreur lors de l\'upload audio:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire toutes les questions
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
            const questions = await questionsService.getAllQuestions(limit);
            res.status(200).json(questions);
        } catch (error) {
            console.error('Erreur lors de la récupération des questions:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire une question par son ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const question = await questionsService.getQuestionById(id);

            if (!question) {
                res.status(404).json({ error: 'Question non trouvée' });
                return;
            }

            res.status(200).json(question);
        } catch (error) {
            console.error('Erreur lors de la récupération de la question:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Mettre à jour une question
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = updateQuestionSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updatedQuestion = await questionsService.updateQuestion(id, parsed.data);
            
            if (!updatedQuestion) {
                res.status(404).json({ error: 'Question non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Question mise à jour avec succès', question: updatedQuestion });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la question:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Supprimer une question
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedQuestion = await questionsService.deleteQuestion(id);

            if (!deletedQuestion) {
                res.status(404).json({ error: 'Question non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Question supprimée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la question:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
