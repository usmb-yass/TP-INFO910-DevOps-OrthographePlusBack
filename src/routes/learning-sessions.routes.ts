import { Router } from 'express';
import { learningSessionsController } from '../controllers/learning-sessions.controller';

const router = Router();

router.post('/start', learningSessionsController.startSession);
router.post('/:id/submit-answer', learningSessionsController.submitAnswer);
router.post('/:id/finish', learningSessionsController.finishSession);
router.delete('/training', learningSessionsController.deleteCurrentTraining);

export default router;
