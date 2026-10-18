import { Schema, model, Types } from "mongoose";
import UserProgress from '#shared/types/UserProgress';

const UserProgressSchema = new Schema<UserProgress<Types.ObjectId>>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    programId: {
        type: Schema.Types.ObjectId,
        ref: "programs",
        required: true,
    },
    currentLessonId: {
        type: Schema.Types.ObjectId,
        ref: "lessons",
        required: true,
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    seenCategories: {
        type: [Schema.Types.ObjectId],
        ref: "categories",
        default: []
    },
    seenRules: {
        type: [Schema.Types.ObjectId],
        ref: "rules",
        default: []
    }
}, {
    timestamps: false
});

const UserProgressesModel = model<UserProgress<Types.ObjectId>>("user-progresses", UserProgressSchema);
export default UserProgressesModel;
