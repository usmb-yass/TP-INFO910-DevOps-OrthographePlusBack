import { Request, Response } from 'express';
import { lessonsService } from '../services/lessons.service';
import { lessonSchema } from '../schemas/LessonSchema';

export const lessonsController = {
    // Créer une nouvelle leçon
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = lessonSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const newLesson = await lessonsService.createLesson(parsed.data);
            res.status(201).json({ message: 'Leçon créée avec succès', lesson: newLesson });
        } catch (error: any) {
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Une leçon avec ce nom existe déjà' });
                return;
            }
            console.error('Erreur lors de la création de la leçon:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire toutes les leçons
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
            const lessons = await lessonsService.getAllLessons(limit);
            res.status(200).json(lessons);
        } catch (error) {
            console.error('Erreur lors de la récupération des leçons:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire une leçon par son ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const lesson = await lessonsService.getLessonById(id);

            if (!lesson) {
                res.status(404).json({ error: 'Leçon non trouvée' });
                return;
            }

            res.status(200).json(lesson);
        } catch (error) {
            console.error('Erreur lors de la récupération de la leçon:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Mettre à jour une leçon
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = lessonSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updatedLesson = await lessonsService.updateLesson(id, parsed.data);
            
            if (!updatedLesson) {
                res.status(404).json({ error: 'Leçon non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Leçon mise à jour avec succès', lesson: updatedLesson });
        } catch (error: any) {
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Une leçon avec ce nom existe déjà' });
                return;
            }
            console.error('Erreur lors de la mise à jour de la leçon:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Supprimer une leçon
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedLesson = await lessonsService.deleteLesson(id);

            if (!deletedLesson) {
                res.status(404).json({ error: 'Leçon non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Leçon supprimée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la leçon:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
