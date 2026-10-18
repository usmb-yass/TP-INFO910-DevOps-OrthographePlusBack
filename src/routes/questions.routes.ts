import { Router } from 'express';
import { questionsController } from '../controllers/questions.controller';
import { uploadAudioMiddleware } from '../middlewares/upload.middleware';

const adminQuestionsRoutes = Router();
// Lire toutes les questions (accessible uniquement aux admins)
adminQuestionsRoutes.get('/', questionsController.getAll);
// Lire une question par ID (accessible uniquement aux admins)
adminQuestionsRoutes.get('/:id', questionsController.getById);
// Uploader un fichier audio (accessible uniquement aux admins)
adminQuestionsRoutes.post('/upload-audio', uploadAudioMiddleware.single('audio'), questionsController.uploadAudio);
// Créer une nouvelle question (accessible uniquement aux admins)
adminQuestionsRoutes.post('/', questionsController.create);
// Mettre à jour une question (accessible uniquement aux admins)
adminQuestionsRoutes.put('/:id', questionsController.update);
// Supprimer une question (accessible uniquement aux admins)
adminQuestionsRoutes.delete('/:id', questionsController.delete);

export { adminQuestionsRoutes };
