import { ClassesModel } from '../models';
import { createClassSchema } from '#shared/schemas/Class/CreateClassSchema';
import { updateClassSchema } from '#shared/schemas/Class/UpdateClassSchema';
import { z } from 'zod';

export const classesService = {
    async getClassesBySchool(schoolId: string) {
        return await ClassesModel.find({ schoolId }).populate('gradeLevelId').sort({ createdAt: -1 });
    },

    async createClass(data: z.infer<typeof createClassSchema>, schoolId: string) {
        const newClass = new ClassesModel({
            name: data.name,
            gradeLevelId: data.gradeLevelId,
            schoolId: schoolId
        });
        await newClass.save();
        return newClass;
    },

    async updateClass(classId: string, data: z.infer<typeof updateClassSchema>, schoolId: string) {
        const cls = await ClassesModel.findOne({ _id: classId, schoolId });
        if (!cls) {
            throw new Error('CLASS_NOT_FOUND');
        }

        if (data.name) cls.name = data.name;
        if (data.gradeLevelId) cls.gradeLevelId = data.gradeLevelId as any;

        await cls.save();
        return cls;
    },

    async deleteClass(classId: string, schoolId: string) {
        const result = await ClassesModel.deleteOne({ _id: classId, schoolId });
        if (result.deletedCount === 0) {
            throw new Error('CLASS_NOT_FOUND');
        }
        return true;
    }
};
