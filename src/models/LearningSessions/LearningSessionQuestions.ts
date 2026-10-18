import { Schema, Types } from "mongoose";
import LearningSessionQuestion from '#shared/types/LearningSession/LearningSessionQuestion';

const LearningSessionQuestionSchema = new Schema<LearningSessionQuestion<Types.ObjectId>>({
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "questions",
        required: true
    },
    userAnswer: {
        type: String,
        default: undefined
    },
    isCorrect: {
        type: Boolean,
        default: undefined
    },
    answeredAt: {
        type: Date,
        default: undefined
    }
}, { _id: false });

export default LearningSessionQuestionSchema;
