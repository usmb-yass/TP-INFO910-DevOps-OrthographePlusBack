import { Request, Response } from 'express';
import { categoriesService } from '../services/categories.service';
import { categorySchema } from '#shared/schemas/CategorySchema';

export const categoriesController = {
    // Créer une nouvelle catégorie
    async create(req: Request, res: Response): Promise<void> {
        try {
            const parsed = categorySchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const newCategory = await categoriesService.createCategory(parsed.data);
            res.status(201).json({ message: 'Catégorie créée avec succès', category: newCategory });
        } catch (error: any) {
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Une catégorie avec ce nom existe déjà' });
                return;
            }
            console.error('Erreur lors de la création de la catégorie:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Récupérer toutes les catégories
    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const categories = await categoriesService.getAllCategories();
            res.status(200).json(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Récupérer une catégorie par son ID
    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const category = await categoriesService.getCategoryById(id);

            if (!category) {
                res.status(404).json({ error: 'Catégorie non trouvée' });
                return;
            }

            res.status(200).json(category);
        } catch (error) {
            console.error('Erreur lors de la récupération de la catégorie:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Mettre à jour une catégorie
    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const parsed = categorySchema.partial().safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const updatedCategory = await categoriesService.updateCategory(id, parsed.data);
            if (!updatedCategory) {
                res.status(404).json({ error: 'Catégorie non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Catégorie mise à jour avec succès', category: updatedCategory });
        } catch (error: any) {
            if (error.message === 'DUPLICATE_NAME') {
                res.status(409).json({ error: 'Une catégorie avec ce nom existe déjà' });
                return;
            }
            console.error('Erreur lors de la mise à jour de la catégorie:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    },

    // Supprimer une catégorie
    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id as string;
            const deletedCategory = await categoriesService.deleteCategory(id);

            if (!deletedCategory) {
                res.status(404).json({ error: 'Catégorie non trouvée' });
                return;
            }

            res.status(200).json({ message: 'Catégorie supprimée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie:', error);
            res.status(500).json({ error: 'Erreur serveur interne' });
        }
    }
};
