import { Router } from 'express';
import { gradeLevelsController } from '../controllers/grade-levels.controller';

const gradeLevelsRoutes = Router();
gradeLevelsRoutes.get('/', gradeLevelsController.getAll);

const adminGradeLevelsRoutes = Router();
adminGradeLevelsRoutes.get('/:id', gradeLevelsController.getById);
adminGradeLevelsRoutes.post('/', gradeLevelsController.create);
adminGradeLevelsRoutes.put('/:id', gradeLevelsController.update);
adminGradeLevelsRoutes.delete('/:id', gradeLevelsController.delete);

export { gradeLevelsRoutes, adminGradeLevelsRoutes };
