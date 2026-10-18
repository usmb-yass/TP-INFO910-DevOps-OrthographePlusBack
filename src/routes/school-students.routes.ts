import { Router } from 'express';
import { schoolStudentsController } from '../controllers/school-students.controller';

const router = Router();

router.get('/', schoolStudentsController.getStudents);
router.post('/invite', schoolStudentsController.invite);
router.delete('/invitations/:id', schoolStudentsController.revoke);

export default router;
