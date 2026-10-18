import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';

const adminSettingsRoutes = Router();

// Toutes ces routes sont protégées par le middleware admin dans index.ts
// Lire tous les paramètres
adminSettingsRoutes.get('/', settingsController.getAll);
// Lire un paramètre par ID
adminSettingsRoutes.get('/:id', settingsController.getById);
// Mettre à jour un paramètre
adminSettingsRoutes.put('/:id', settingsController.update);

export { adminSettingsRoutes };
