import { Schema, model, Types } from "mongoose";
import Rule from '#shared/types/Rule';

const RuleSchema = new Schema<Rule<Types.ObjectId>>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    },

    categoryId: {
        type: Schema.Types.ObjectId,
        ref: "categories",
        required: true
    }
});

const RulesModel = model<Rule<Types.ObjectId>>("rules", RuleSchema);
export default RulesModel;