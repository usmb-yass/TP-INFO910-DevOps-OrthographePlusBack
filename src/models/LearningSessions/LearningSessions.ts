import { Schema, model, Types } from "mongoose";
import LearningSessionQuestionSchema from "./LearningSessionQuestions";
import LearningSessionType from '#shared/enums/LearningSession/LearningSessionType';
import LearningSessionStatus from '#shared/enums/LearningSession/LearningSessionStatus';
import LearningSession from '#shared/types/LearningSession/LearningSession';

const LearningSessionSchema = new Schema<LearningSession<Types.ObjectId>>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    userProgressId: {
        type: Schema.Types.ObjectId,
        ref: "user-progresses"
    },
    type: {
        type: String,
        enum: Object.values(LearningSessionType),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(LearningSessionStatus),
        default: LearningSessionStatus.IN_PROGRESS
    },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: "lessons"
    },
    attemptNumber: {
        type: Number,
        default: 1
    },
    scorePercentage: {
        type: Number
    },
    isPassed: {
        type: Boolean
    },
    currentQuestionIndex: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number,
        default: 0
    },
    questions: {
        type: [LearningSessionQuestionSchema],
        required: true
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    xpGained: [{
        type: { type: String, required: true },
        amount: { type: Number, required: true }
    }]
}, {
    timestamps: false
});

const LearningSessionsModel = model<LearningSession<Types.ObjectId>>("learning-sessions", LearningSessionSchema);
export default LearningSessionsModel;
