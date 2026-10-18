import { GradeLevelsModel } from '../models';
import GradeLevel from '#shared/types/GradeLevel';
import { Types } from 'mongoose';

export const gradeLevelsService = {
    async createGradeLevel(data: Partial<GradeLevel<Types.ObjectId>>) {
        const gradeLevel = new GradeLevelsModel(data);
        return await gradeLevel.save();
    },

    async getAllGradeLevels() {
        return await GradeLevelsModel.find().sort({ level: 1 }).lean();
    },

    async getGradeLevelById(id: string) {
        return await GradeLevelsModel.findById(id).lean();
    },

    async updateGradeLevel(id: string, data: Partial<GradeLevel<Types.ObjectId>>) {
        return await GradeLevelsModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true }).lean();
    },

    async deleteGradeLevel(id: string) {
        return await GradeLevelsModel.findByIdAndDelete(id).lean();
    }
};
