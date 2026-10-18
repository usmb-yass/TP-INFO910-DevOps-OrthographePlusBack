import { Schema, model, Types } from "mongoose";
import Class from '#shared/types/Class';

const ClassSchema = new Schema<Class<Types.ObjectId>>({
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "schools",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    gradeLevelId: {
        type: Schema.Types.ObjectId,
        ref: "grade-levels",
        required: true
    }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const ClassesModel = model<Class<Types.ObjectId>>("classes", ClassSchema);
export default ClassesModel;
