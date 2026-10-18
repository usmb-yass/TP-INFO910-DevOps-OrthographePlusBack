import { Types } from 'mongoose';
import { QuestionsModel } from '../models';
import Question from '#shared/types/Question/Question';
import fs from 'fs';
import path from 'path';
import { audioDir } from '../middlewares/upload.middleware';
import QuestionType from '#shared/enums/QuestionType';

export const questionsService = {
    async createQuestion(data: Partial<Question<Types.ObjectId>>) {
        const newQuestion = new QuestionsModel(data);
        return await newQuestion.save();
    },

    async getAllQuestions(limit?: number) {
        // La limite est appliquée au niveau de la DB lors du await
        let query = QuestionsModel.find().populate('ruleId');
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    },

    async getQuestionById(id: string) {
        return await QuestionsModel.findById(id).populate('ruleId');
    },

    async updateQuestion(id: string, data: Partial<Question<Types.ObjectId>>) {
        const oldQuestion = await QuestionsModel.findById(id);
        
        if (oldQuestion?.type === QuestionType.TROU && oldQuestion.data && 'audioUrl' in oldQuestion.data) {
            const oldAudioUrl = oldQuestion.data.audioUrl;
            
            let shouldDeleteAudio = false;
            
            if (data.type && data.type !== QuestionType.TROU) {
                shouldDeleteAudio = true;
            } else if (data.data && 'audioUrl' in data.data) {
                const newAudioUrl = data.data.audioUrl;
                if (oldAudioUrl !== newAudioUrl) {
                    shouldDeleteAudio = true;
                }
            }
            
            if (shouldDeleteAudio && oldAudioUrl) {
                const oldPath = path.join(audioDir, oldAudioUrl);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
        }

        return await QuestionsModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    },

    async deleteQuestion(id: string) {
        const question = await QuestionsModel.findById(id);
        if (question?.type === QuestionType.TROU && question.data && 'audioUrl' in question.data && question.data.audioUrl) {
            const oldPath = path.join(audioDir, question.data.audioUrl);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        return await QuestionsModel.findByIdAndDelete(id);
    },

    async getRandomQuestionsByRule(ruleId: Types.ObjectId, limit: number, excludeIds?: Types.ObjectId[]) {
        const matchStage: any = { ruleId, isDisabled: { $ne: true } }; // On utilise $ne: true car la propriété isDisabled n'existe en base que si elle est activée ($ne couvre les cas : Le champ vaut false, Le champ vaut null, Le champ n'existe pas)
        if (excludeIds && excludeIds.length > 0) {
            matchStage._id = { $nin: excludeIds };
        }
        let questions = await QuestionsModel.aggregate([
            { $match: matchStage },
            { $sample: { size: limit } }
        ]);

        if (questions.length < limit) {
            // S'il nous manque des questions et qu'on avait des exclusions, on pioche dans les exclusions
            if (excludeIds && excludeIds.length > 0) {
                const remainingLimit = limit - questions.length;
                const matchStageNoExclude = { 
                    ruleId, 
                    isDisabled: { $ne: true }, 
                    _id: { $nin: questions.map(q => q._id) } // On exclut celles qu'on a déjà récupérées
                };
                const fallbackQuestions = await QuestionsModel.aggregate([
                    { $match: matchStageNoExclude },
                    { $sample: { size: remainingLimit } }
                ]);
                questions = questions.concat(fallbackQuestions);
            }

            // S'il manque TOUJOURS des questions, on duplique circulairement pour espacer au maximum les doublons
            if (questions.length > 0 && questions.length < limit) {
                const initialLength = questions.length;
                const needed = limit - initialLength;
                for (let i = 0; i < needed; i++) {
                    // On clone l'objet pour s'assurer qu'il n'y a pas de problème de référence
                    questions.push(JSON.parse(JSON.stringify(questions[i % initialLength])));
                }
            }
        }

        return questions;
    }
};
