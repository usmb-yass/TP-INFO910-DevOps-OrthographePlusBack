import { Router } from 'express';
import { usersController } from '../controllers/users.controller';
import { uploadProfilePictureMiddleware } from '../middlewares/upload.middleware';

export const adminUsersRoutes = Router();
adminUsersRoutes.get('/', usersController.getAll);

export const usersRoutes = Router();
usersRoutes.post('/upload-profile-picture', uploadProfilePictureMiddleware.single('picture'), usersController.uploadProfilePicture);
usersRoutes.patch('/connection-duration', usersController.updateConnectionDuration);
