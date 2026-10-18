import { LessonsModel } from '../models';
import Lesson from '#shared/types/Lesson';
import { Types } from 'mongoose';

export const lessonsService = {
    async createLesson(data: Partial<Lesson<Types.ObjectId>>) {
        const existingLesson = await LessonsModel.findOne({ name: data.name });
        if (existingLesson) {
            throw new Error('DUPLICATE_NAME');
        }
        const newLesson = new LessonsModel(data);
        return await newLesson.save();
    },

    async getAllLessons(limit?: number) {
        // La limite est appliquée au niveau de la DB lors du await
        let query = LessonsModel.find().populate('rules.ruleId');
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    },

    async getLessonById(id: string) {
        return await LessonsModel.findById(id).populate('rules.ruleId');
    },

    async updateLesson(id: string, data: Partial<Lesson<Types.ObjectId>>) {
        if (data.name) {
            const existingLesson = await LessonsModel.findOne({ name: data.name, _id: { $ne: id } });
            if (existingLesson) {
                throw new Error('DUPLICATE_NAME');
            }
        }
        return await LessonsModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    },

    async deleteLesson(id: string) {
        return await LessonsModel.findByIdAndDelete(id);
    }
};
