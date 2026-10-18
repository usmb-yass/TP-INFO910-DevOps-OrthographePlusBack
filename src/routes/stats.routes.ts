import { Router } from 'express';
import { statsController } from '../controllers/stats.controller';

const router = Router();

// GET /stats/my-stats
router.get('/my-stats', statsController.getMyStats);

export default router;
