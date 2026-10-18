import { Router } from 'express';
import { categoriesController } from '../controllers/categories.controller';

const adminCategoriesRoutes = Router();

// Récupérer toutes les catégories (accessible aux admins)
adminCategoriesRoutes.get('/', categoriesController.getAll);

// Récupérer une catégorie par ID (accessible aux admins)
adminCategoriesRoutes.get('/:id', categoriesController.getById);

// Créer une nouvelle catégorie (accessible aux admins)
adminCategoriesRoutes.post('/', categoriesController.create);

// Mettre à jour une catégorie (accessible aux admins)
adminCategoriesRoutes.put('/:id', categoriesController.update);

// Supprimer une catégorie (accessible aux admins)
adminCategoriesRoutes.delete('/:id', categoriesController.delete);

export { adminCategoriesRoutes };
