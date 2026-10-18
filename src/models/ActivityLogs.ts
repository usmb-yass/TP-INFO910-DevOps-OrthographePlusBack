import { Schema, model, Types } from "mongoose";
import ActivityLog from '#shared/types/ActivityLog';

const ActivityLogSchema = new Schema<ActivityLog<Types.ObjectId>>({
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    schoolId: { type: Schema.Types.ObjectId, ref: "schools" },
    type: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    details: { type: String }
});

const ActivityLogModel = model<ActivityLog<Types.ObjectId>>("activity-logs", ActivityLogSchema);
export default ActivityLogModel;
