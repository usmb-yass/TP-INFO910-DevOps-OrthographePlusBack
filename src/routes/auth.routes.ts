import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authLimiter } from '../middlewares/rate-limiter';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Routes publiques (avec limiteur strict)
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/admin/login', authLimiter, authController.adminLogin);
router.post('/admin/verify', authLimiter, authController.adminVerify);
router.post('/school-admin/register', authLimiter, authController.registerSchoolAdmin);

// Récupération du profil de l'utilisateur connecté
router.get('/me', requireAuth, authController.getMe);

export default router;
