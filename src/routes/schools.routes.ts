import { Router } from 'express';
import { schoolsController } from '../controllers/schools.controller';

export const adminSchoolsRoutes = Router();

// Toutes ces routes seront préfixées par /admin/schools et protégées par requireAdmin (défini dans routes/index.ts)
adminSchoolsRoutes.post('/', schoolsController.create);
adminSchoolsRoutes.get('/', schoolsController.getAll);

export const schoolAdminProfileRoutes = Router();
schoolAdminProfileRoutes.get('/me', schoolsController.getProfile);
