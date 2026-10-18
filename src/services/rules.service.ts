import { RulesModel, CategoriesModel } from '../models';
import Rule from '#shared/types/Rule';
import { Types } from 'mongoose';

export const rulesService = {
    async createRule(data: Partial<Rule<Types.ObjectId>>) {
        if (data.categoryId) {
            const categoryExists = await CategoriesModel.findById(data.categoryId);
            if (!categoryExists) {
                throw new Error('CATEGORY_NOT_FOUND');
            }
        }

        const existingRule = await RulesModel.findOne({ name: data.name });
        if (existingRule) {
            throw new Error('DUPLICATE_NAME');
        }
        const newRule = new RulesModel(data);
        return await newRule.save();
    },

    async getAllRules(limit?: number) {
        // La limite est appliquée au niveau de la DB lors du await
        let query = RulesModel.find().populate('categoryId');
        if (limit) {
            query = query.limit(limit);
        }
        return await query;
    },

    async getRuleById(id: string) {
        return await RulesModel.findById(id).populate('categoryId');
    },

    async updateRule(id: string, data: Partial<Rule<Types.ObjectId>>) {
        if (data.categoryId) {
            const categoryExists = await CategoriesModel.findById(data.categoryId);
            if (!categoryExists) {
                throw new Error('CATEGORY_NOT_FOUND');
            }
        }

        if (data.name) {
            const existingRule = await RulesModel.findOne({ name: data.name, _id: { $ne: id } });
            if (existingRule) {
                throw new Error('DUPLICATE_NAME');
            }
        }
        return await RulesModel.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
    },

    async deleteRule(id: string) {
        return await RulesModel.findByIdAndDelete(id);
    }
};
