import { Request, Response } from 'express';
import { gradeLevelsService } from '../services/grade-levels.service';
import { gradeLevelSchema } from '#shared/schemas/GradeLevelSchema';

export const gradeLevelsController = {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = gradeLevelSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }
            const newGradeLevel = await gradeLevelsService.createGradeLevel(parsed.data);
            res.status(201).json({ message: 'Grade Level créé avec succès', gradeLevel: newGradeLevel });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ error: 'Un niveau avec ce numéro existe déjà' });
                return;
            }
            console.error('Erreur lors de la création du grade level:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const gradeLevels = await gradeLevelsService.getAllGradeLevels();
            res.status(200).json(gradeLevels);
        } catch (error) {
            console.error('Erreur lors de la récupération des grade levels:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const gradeLevel = await gradeLevelsService.getGradeLevelById(id);
            if (!gradeLevel) {
                res.status(404).json({ error: 'Grade Level non trouvé' });
                return;
            }
            res.status(200).json(gradeLevel);
        } catch (error) {
            console.error('Erreur lors de la récupération du grade level:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = gradeLevelSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }
            const updatedGradeLevel = await gradeLevelsService.updateGradeLevel(id, parsed.data);
            if (!updatedGradeLevel) {
                res.status(404).json({ error: 'Grade Level non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Grade Level mis à jour avec succès', gradeLevel: updatedGradeLevel });
        } catch (error: any) {
            if (error.code === 11000) {
                res.status(409).json({ error: 'Un niveau avec ce numéro existe déjà' });
                return;
            }
            console.error('Erreur lors de la mise à jour du grade level:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedGradeLevel = await gradeLevelsService.deleteGradeLevel(id);
            if (!deletedGradeLevel) {
                res.status(404).json({ error: 'Grade Level non trouvé' });
                return;
            }
            res.status(200).json({ message: 'Grade Level supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du grade level:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
