import { Router } from 'express';
import { lessonsController } from '../controllers/lessons.controller';

const adminLessonsRoutes = Router();
// Lire toutes les leçons (accessible uniquement aux admins)
adminLessonsRoutes.get('/', lessonsController.getAll);
// Lire une leçon par ID (accessible uniquement aux admins)
adminLessonsRoutes.get('/:id', lessonsController.getById);
// Créer une nouvelle leçon (accessible uniquement aux admins)
adminLessonsRoutes.post('/', lessonsController.create);
// Mettre à jour une leçon (accessible uniquement aux admins)
adminLessonsRoutes.put('/:id', lessonsController.update);
// Supprimer une leçon (accessible uniquement aux admins)
adminLessonsRoutes.delete('/:id', lessonsController.delete);

export { adminLessonsRoutes };

