import crypto from 'crypto';
import { SchoolModel, SchoolInvitationModel } from '../models';
import { Role } from '#shared/enums/Role';
import { Types } from 'mongoose';
import { createSchoolSchema } from '#shared/schemas/School/CreateSchoolSchema';
import { z } from 'zod';

export const schoolsService = {
    async createSchool(data: z.infer<typeof createSchoolSchema>, adminId: string) {
        // 1. Vérifier si l'email de l'école n'est pas déjà utilisé pour une autre école
        const existingSchool = await SchoolModel.findOne({ email: data.email });
        if (existingSchool) {
            throw new Error('EMAIL_ALREADY_USED');
        }

        // 2. Créer l'école
        const school = new SchoolModel({
            name: data.name,
            email: data.email,
            country: data.country,
            licences: {
                totalSlots: data.maxLicenses,
                slotsUsed: 0
            }
        });
        await school.save();

        // 3. Générer un token pour l'invitation du School Admin
        const token = crypto.randomBytes(32).toString('hex');

        // 4. Créer l'invitation pour le School Admin
        const invitation = new SchoolInvitationModel({
            schoolId: school._id,
            invitedByUserId: new Types.ObjectId(adminId),
            email: data.email,
            role: Role.SCHOOL_ADMIN,
            status: 'PENDING',
            token: token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 jours
        });
        await invitation.save();

        // 5. Simuler l'envoi de l'email (à remplacer plus tard)
        console.log(`[SIMULATION EMAIL] Invitation envoyée à ${data.email}. Lien d'inscription (token): ${token}`);

        return {
            school,
            invitationToken: token // Retourné pour faciliter les tests
        };
    },

    async getAllSchools() {
        return await SchoolModel.find().populate('schoolAdminId', 'firstName lastName email').sort({ createdAt: -1 });
    },

    async getSchoolById(schoolId: string) {
        return await SchoolModel.findById(schoolId);
    }
};
