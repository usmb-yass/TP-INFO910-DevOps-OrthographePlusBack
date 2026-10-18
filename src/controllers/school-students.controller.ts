import { Request, Response } from 'express';
import { schoolStudentsService } from '../services/school-students.service';
import { inviteStudentSchema } from '#shared/schemas/StudentInvitation/InviteStudentSchema';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const schoolStudentsController = {
    async getStudents(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Accès interdit.' });
                return;
            }
            const data = await schoolStudentsService.getStudentsBySchool(schoolId);
            res.status(200).json(data);
        } catch (error) {
            console.error('Erreur getStudents:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    async invite(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            const adminId = req.user?.id;
            if (!schoolId || !adminId) {
                res.status(403).json({ error: 'Accès interdit.' });
                return;
            }

            const parsed = inviteStudentSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Données invalides', details: parsed.error.format() });
                return;
            }

            const result = await schoolStudentsService.inviteStudent(parsed.data, schoolId, adminId);
            res.status(201).json({
                message: 'Élève invité avec succès',
                invitation: result.invitation,
                invitationToken: result.invitationToken
            });
        } catch (error: any) {
            if (error.message === 'LICENCES_LIMIT_REACHED') {
                res.status(403).json({ error: 'Limite de licences atteinte pour cette école.' });
                return;
            }
            if (error.message === 'EMAIL_ALREADY_USED') {
                res.status(409).json({ error: 'Cet email est déjà utilisé par un autre compte.' });
                return;
            }
            if (error.message === 'ALREADY_INVITED') {
                res.status(409).json({ error: 'Une invitation est déjà en attente pour cet email.' });
                return;
            }
            console.error('Erreur inviteStudent:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    },

    async revoke(req: AuthenticatedRequest, res: Response): Promise<void> {
        try {
            const schoolId = req.user?.schoolId;
            if (!schoolId) {
                res.status(403).json({ error: 'Accès interdit.' });
                return;
            }

            await schoolStudentsService.revokeInvitation(req.params.id as string, schoolId);
            res.status(200).json({ message: 'Invitation révoquée' });
        } catch (error: any) {
            if (error.message === 'INVITATION_NOT_FOUND') {
                res.status(404).json({ error: 'Invitation introuvable ou déjà traitée' });
                return;
            }
            console.error('Erreur revokeInvitation:', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
};
