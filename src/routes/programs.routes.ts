import { Router } from 'express';
import { programsController } from '../controllers/programs.controller';

const adminProgramsRoutes = Router();
// Lire tous les programmes (accessible uniquement aux admins)
adminProgramsRoutes.get('/', programsController.getAll);
// Lire un programme par ID (accessible uniquement aux admins)
adminProgramsRoutes.get('/:id', programsController.getById);
// Créer un nouveau programme (accessible uniquement aux admins)
adminProgramsRoutes.post('/', programsController.create);
// Mettre à jour un programme (accessible uniquement aux admins)
adminProgramsRoutes.put('/:id', programsController.update);
// Supprimer un programme (accessible uniquement aux admins)
adminProgramsRoutes.delete('/:id', programsController.delete);

export { adminProgramsRoutes };

