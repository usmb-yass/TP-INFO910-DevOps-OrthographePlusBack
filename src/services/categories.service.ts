import { CategoriesModel } from '../models';

export const categoriesService = {
    async createCategory(data: any) {
        const existingCategory = await CategoriesModel.findOne({ name: data.name });
        if (existingCategory) {
            throw new Error('DUPLICATE_NAME');
        }
        const newCategory = new CategoriesModel(data);
        return await newCategory.save();
    },

    async getAllCategories() {
        return await CategoriesModel.find();
    },

    async getCategoryById(id: string) {
        return await CategoriesModel.findById(id);
    },

    async updateCategory(id: string, data: any) {
        if (data.name) {
            const existingCategory = await CategoriesModel.findOne({ name: data.name, _id: { $ne: id } });
            if (existingCategory) {
                throw new Error('DUPLICATE_NAME');
            }
        }
        return await CategoriesModel.findByIdAndUpdate(id, data, { returnDocument: 'after' });
    },

    async deleteCategory(id: string) {
        return await CategoriesModel.findByIdAndDelete(id);
    }
};
