import { Schema, model, Types } from "mongoose";
import Category from '#shared/types/Category';

const CategorySchema = new Schema<Category<Types.ObjectId>>({
    name: {
        type: String,
        required: true,
        unique: true
    }
});

const CategoriesModel = model<Category<Types.ObjectId>>("categories", CategorySchema);
export default CategoriesModel;
