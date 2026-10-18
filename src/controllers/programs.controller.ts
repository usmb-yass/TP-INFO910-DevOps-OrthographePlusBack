import { Request, Response } from 'express';
import { programsService } from '../services/programs.service';
import { programSchema } from '../schemas/ProgramSchema';

export const programsController = {
    // Créer un nouveau programme
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = programSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const newProgram = await programsService.createProgram(parsed.data);
            res.status(201).json({ message: 'Programme créé avec succès', program: newProgram });
        } catch (error: any) {
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Un programme avec ce nom existe déjà' });
                return;
            }
            if (error.message === 'MAX_LESSONS_EXCEEDED') {
                res.status(400).json({ error: 'Le nombre de leçons dépasse la limite autorisée par programme' });
                return;
            }
            console.error('Erreur lors de la création du programme:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire tous les programmes
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
            const programs = await programsService.getAllPrograms(limit);
            res.status(200).json(programs);
        } catch (error) {
            console.error('Erreur lors de la récupération des programmes:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Lire un programme par son ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const program = await programsService.getProgramById(id);

            if (!program) {
                res.status(404).json({ error: 'Programme non trouvé' });
                return;
            }

            res.status(200).json(program);
        } catch (error) {
            console.error('Erreur lors de la récupération du programme:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Mettre à jour un programme
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = programSchema.partial().safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updatedProgram = await programsService.updateProgram(id, parsed.data);
            
            if (!updatedProgram) {
                res.status(404).json({ error: 'Programme non trouvé' });
                return;
            }

            res.status(200).json({ message: 'Programme mis à jour avec succès', program: updatedProgram });
        } catch (error: any) {
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Un programme avec ce nom existe déjà' });
                return;
            }
            if (error.message === 'MAX_LESSONS_EXCEEDED') {
                res.status(400).json({ error: 'Le nombre de leçons dépasse la limite autorisée par programme' });
                return;
            }
            console.error('Erreur lors de la mise à jour du programme:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Supprimer un programme
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedProgram = await programsService.deleteProgram(id);

            if (!deletedProgram) {
                res.status(404).json({ error: 'Programme non trouvé' });
                return;
            }

            res.status(200).json({ message: 'Programme supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du programme:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
