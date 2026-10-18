import crypto from 'crypto';
import { SchoolModel, StudentInvitationModel, UserModel } from '../models';
import { Types } from 'mongoose';
import { inviteStudentSchema } from '#shared/schemas/StudentInvitation/InviteStudentSchema';
import { z } from 'zod';
import { Role } from '#shared/enums/Role';

export const schoolStudentsService = {
    async getStudentsBySchool(schoolId: string) {
        // Retourne les élèves déjà inscrits via une licence école
        const users = await UserModel.find({ schoolId, role: Role.STUDENT, isSchoolLicense: true })
            .populate('classId', 'name')
            .sort({ createdAt: -1 });
            
        // On peut aussi retourner les invitations en attente si besoin (pour l'UI)
        const pendingInvitations = await StudentInvitationModel.find({ schoolId, status: 'PENDING' })
            .populate('classId', 'name')
            .sort({ createdAt: -1 });

        return {
            users,
            pendingInvitations
        };
    },

    async inviteStudent(data: z.infer<typeof inviteStudentSchema>, schoolId: string, adminId: string) {
        // 1. Vérifier l'école et les licences
        const school = await SchoolModel.findById(schoolId);
        if (!school) {
            throw new Error('SCHOOL_NOT_FOUND');
        }

        if (school.licences.slotsUsed >= school.licences.totalSlots) {
            throw new Error('LICENCES_LIMIT_REACHED');
        }

        // 2. Vérifier si l'email n'est pas déjà utilisé
        const existingUser = await UserModel.findOne({ email: data.email });
        if (existingUser) {
            throw new Error('EMAIL_ALREADY_USED');
        }

        const existingInvitation = await StudentInvitationModel.findOne({ email: data.email, status: 'PENDING' });
        if (existingInvitation) {
            throw new Error('ALREADY_INVITED');
        }

        // 3. Incrémenter les licences utilisées
        school.licences.slotsUsed += 1;
        await school.save();

        // 4. Créer l'invitation
        const token = crypto.randomBytes(32).toString('hex');
        const invitation = new StudentInvitationModel({
            schoolId: new Types.ObjectId(schoolId),
            classId: new Types.ObjectId(data.classId),
            invitedByUserId: new Types.ObjectId(adminId),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            status: 'PENDING',
            token: token,
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 jours
        });
        await invitation.save();

        // 5. Simuler l'envoi d'email
        console.log(`[SIMULATION EMAIL] Invitation élève envoyée à ${data.email}. Lien d'inscription (token): ${token}`);

        return {
            invitation,
            invitationToken: token
        };
    },

    async revokeInvitation(invitationId: string, schoolId: string) {
        const invitation = await StudentInvitationModel.findOne({ _id: invitationId, schoolId, status: 'PENDING' });
        if (!invitation) {
            throw new Error('INVITATION_NOT_FOUND');
        }

        // Remettre la licence
        const school = await SchoolModel.findById(schoolId);
        if (school && school.licences.slotsUsed > 0) {
            school.licences.slotsUsed -= 1;
            await school.save();
        }

        invitation.status = 'REVOKED';
        await invitation.save();
        return true;
    }
};
