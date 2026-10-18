import { Router } from 'express';
import { rulesController } from '../controllers/rules.controller';

const adminRulesRoutes = Router();
// Lire toutes les règles (accessible uniquement aux admins)
adminRulesRoutes.get('/', rulesController.getAll);
// Lire une règle par ID (accessible uniquement aux admins)
adminRulesRoutes.get('/:id', rulesController.getById);
// Créer une nouvelle règle (accessible uniquement aux admins)
adminRulesRoutes.post('/', rulesController.create);
// Mettre à jour une règle (accessible uniquement aux admins)
adminRulesRoutes.put('/:id', rulesController.update);
// Supprimer une règle (accessible uniquement aux admins)
adminRulesRoutes.delete('/:id', rulesController.delete);

export { adminRulesRoutes };
