import { Router } from 'express';
import authRoutes from './auth.routes';
import { adminRulesRoutes } from './rules.routes';
import { adminQuestionsRoutes } from './questions.routes';
import { adminLessonsRoutes } from './lessons.routes';
import { adminProgramsRoutes } from './programs.routes';
import { adminSettingsRoutes } from './settings.routes';
import { countriesRoutes, adminCountriesRoutes } from './countries.routes';
import { gradeLevelsRoutes, adminGradeLevelsRoutes } from './grade-levels.routes';
import { adminCategoriesRoutes } from './categories.routes';
import { adminSchoolsRoutes } from './schools.routes';
import userProgressesRoutes from './user-progresses.routes';
import learningSessionsRoutes from './learning-sessions.routes';
import statsRoutes from './stats.routes';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Point d'entrée pour les routes d'authentification (publique)
router.use('/auth', authRoutes);

// Routes publiques
// Point d'entrée pour les routes de pays
router.use('/countries', countriesRoutes);
// Point d'entrée pour les routes de niveaux (grade levels)
router.use('/grade-levels', gradeLevelsRoutes);

// Appliquer le middleware d'authentification pour toutes les routes suivantes
router.use(requireAuth);

// Routes utilisateurs (simple authentification requise)
// Point d'entrée pour la progression utilisateur
router.use('/user-progresses', userProgressesRoutes);
// Point d'entrée pour les sessions d'apprentissage
router.use('/learning-sessions', learningSessionsRoutes);
// Point d'entrée pour les statistiques
router.use('/stats', statsRoutes);
// Point d'entrée pour les utilisateurs
import { usersRoutes } from './users.routes';
router.use('/users', usersRoutes);

// Routes administrateurs (authentification + rôle admin requis)
const adminRouter = Router();

// Point d'entrée pour les routes d'administration des règles
adminRouter.use('/rules', adminRulesRoutes);
// Point d'entrée pour les routes d'administration des questions
adminRouter.use('/questions', adminQuestionsRoutes);
// Point d'entrée pour les routes d'administration des leçons
adminRouter.use('/lessons', adminLessonsRoutes);
// Point d'entrée pour les routes d'administration des programmes
adminRouter.use('/programs', adminProgramsRoutes);
// Point d'entrée pour les routes d'administration des paramètres
adminRouter.use('/settings', adminSettingsRoutes);
// Point d'entrée pour les routes d'administration des pays
adminRouter.use('/countries', adminCountriesRoutes);
// Point d'entrée pour les routes d'administration des niveaux (grade levels)
adminRouter.use('/grade-levels', adminGradeLevelsRoutes);
// Point d'entrée pour les routes d'administration des catégories
adminRouter.use('/categories', adminCategoriesRoutes);
// Point d'entrée pour les routes d'administration des écoles
adminRouter.use('/schools', adminSchoolsRoutes);

// Point d'entrée pour les routes d'administration des utilisateurs
import { adminUsersRoutes } from './users.routes';
adminRouter.use('/users', adminUsersRoutes);

// Protège tout le sous-chemin /admin
router.use('/admin', requireAdmin, adminRouter);

// Routes pour l'administration des écoles (School Admin)
import { requireSchoolAdmin } from '../middlewares/auth.middleware';
import schoolClassesRoutes from './classes.routes';
import schoolStudentsRoutes from './school-students.routes';
import { schoolAdminProfileRoutes } from './schools.routes';

const schoolAdminRouter = Router();
schoolAdminRouter.use('/classes', schoolClassesRoutes);
schoolAdminRouter.use('/students', schoolStudentsRoutes);
schoolAdminRouter.use('/profile', schoolAdminProfileRoutes);

router.use('/school-admin', requireSchoolAdmin, schoolAdminRouter);

export default router;
