import { Router } from 'express';
import { userProgressesController } from '../controllers/user-progresses.controller';

const router = Router();

router.get('/my-progress', userProgressesController.getMyProgress);
router.get('/my-categories', userProgressesController.getMyCategories);
router.get('/my-rules', userProgressesController.getMyRules);

export default router;
