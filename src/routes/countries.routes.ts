import { Router } from 'express';
import { countriesController } from '../controllers/countries.controller';

const countriesRoutes = Router();
countriesRoutes.get('/', countriesController.getAll);

const adminCountriesRoutes = Router();
adminCountriesRoutes.get('/:id', countriesController.getById);
adminCountriesRoutes.post('/', countriesController.create);
adminCountriesRoutes.put('/:id', countriesController.update);
adminCountriesRoutes.delete('/:id', countriesController.delete);

export { countriesRoutes, adminCountriesRoutes };
