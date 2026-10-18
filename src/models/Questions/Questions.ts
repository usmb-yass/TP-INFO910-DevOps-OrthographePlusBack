import { Schema, model } from "mongoose";
import QuestionOptionsSchema from "./QuestionOptions";
import QuestionType from '#shared/enums/QuestionType';
import Question from '#shared/types/Question/Question';

const QuestionSchema = new Schema<Question>({
    ruleId: {
        type: Schema.Types.ObjectId,
        ref: "rules",
    },
    isDisabled: {
        type: Boolean
    },
    type: {
        type: String,
        required: true,
        enum: Object.values(QuestionType)
    },
    data: {
        sentence: { type: String, required: true },
        options: { type: [QuestionOptionsSchema], default: undefined },
        correctOption: { type: String, default: undefined },
        answer: { type: [String], default: undefined },
        audioUrl: { type: String, default: undefined }
    }
});

const QuestionsModel = model<Question>("questions", QuestionSchema);
export default QuestionsModel;
