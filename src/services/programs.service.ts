import { ProgramsModel } from '../models';
import Program from '#shared/types/Program';
import { Types } from 'mongoose';

export const programsService = {
    async createProgram(data: Partial<Program<Types.ObjectId>>) {
        const existingProgram = await ProgramsModel.findOne({ name: data.name });
        if (existingProgram) {
            throw new Error('DUPLICATE_NAME');
        }

        const newProgram = new ProgramsModel(data);
        return await newProgram.save();
    },

    async getAllPrograms(limit?: number) {
        // La limite est appliquée au niveau de la DB lors du await
        let query = ProgramsModel.find()
            .populate('gradeLevelId')
            .populate('lessons.lessonId');
        
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    },

    async getProgramById(id: string) {
        return await ProgramsModel.findById(id)
            .populate('gradeLevelId')
            .populate('lessons.lessonId');
    },

    async updateProgram(id: string, data: Partial<Program<Types.ObjectId>>) {
        if (data.name) {
            const existingProgram = await ProgramsModel.findOne({ name: data.name, _id: { $ne: id } });
            if (existingProgram) {
                throw new Error('DUPLICATE_NAME');
            }
        }

        return await ProgramsModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    },

    async deleteProgram(id: string) {
        return await ProgramsModel.findByIdAndDelete(id);
    }
};
