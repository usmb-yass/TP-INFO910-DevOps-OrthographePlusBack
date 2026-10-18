import { Router } from 'express';
import { classesController } from '../controllers/classes.controller';

const router = Router();

router.get('/', classesController.getBySchool);
router.post('/', classesController.create);
router.put('/:id', classesController.update);
router.delete('/:id', classesController.delete);

export default router;
