import UserModel from '../models/Users';
import { Role } from '#shared/enums/Role';
import fs from 'fs';
import path from 'path';
import { profilePictureDir } from '../middlewares/upload.middleware';

export const usersService = {
    async getAllUsers() {
        return await UserModel.find({ role: Role.STUDENT })
            .populate('schoolId', 'name')
            .populate('classId', 'name')
            .populate('countryId', 'name')
            .populate('gradeLevelId', 'name')
            .select('-passwordHash -saltHash') // Exclure les mots de passe
            .sort({ createdAt: -1 });
    },

    async updateProfilePicture(userId: string, filename: string) {
        const user = await UserModel.findById(userId);
        
        if (user && user.profilePicture && user.profilePicture !== 'default.png') {
            const oldPath = path.join(profilePictureDir, user.profilePicture);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }

        return await UserModel.findByIdAndUpdate(
            userId,
            { profilePicture: filename },
            { returnDocument: 'after' }
        );
    },

    async incrementConnectionDuration(userId: string, duration: number) {
        return await UserModel.findByIdAndUpdate(
            userId,
            { $inc: { totalConnectionDuration: duration } },
            { returnDocument: 'after' }
        );
    }
};
