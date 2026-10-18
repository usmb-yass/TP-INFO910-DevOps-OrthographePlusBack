import { Request, Response } from 'express';
import { classesService } from '../services/classes.service';
import { createClassSchema } from '#shared/schemas/Class/CreateClassSchema';
import { updateClassSchema } from '#shared/schemas/Class/UpdateClassSchema';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const classesController = {
    async getBySchool(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Accès interdit. Vous n\'êtes pas lié à une école.' });
                return;
            }
            const classes = await classesService.getClassesBySchool(schoolId);
            res.status(200).json(classes);
        } catch (error) {
            console.error('Erreur getClasses:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    async create(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Accès interdit.' });
                return;
            }

            const parsed = createClassSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const newClass = await classesService.createClass(parsed.data, schoolId);
            res.status(201).json(newClass);
        } catch (error) {
            console.error('Erreur createClass:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    async update(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Accès interdit.' });
                return;
            }

            const parsed = updateClassSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updated = await classesService.updateClass(req.params.id as string, parsed.data, schoolId);
            res.status(200).json(updated);
        } catch (error: any) {
            if (error.message === 'CLASS_NOT_FOUND') {
                res.status(404).json({ error: 'Classe introuvable' });
                return;
            }
            console.error('Erreur updateClass:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Accès interdit.' });
                return;
            }

            await classesService.deleteClass(req.params.id as string, schoolId);
            res.status(200).json({ message: 'Classe supprimée' });
        } catch (error: any) {
            if (error.message === 'CLASS_NOT_FOUND') {
                res.status(404).json({ error: 'Classe introuvable' });
                return;
            }
            console.error('Erreur deleteClass:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
};
