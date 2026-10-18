import { Schema, model, Types } from "mongoose";
import SchoolInvitation from '#shared/types/SchoolInvitation';

const SchoolInvitationSchema = new Schema<SchoolInvitation<Types.ObjectId>>({
    schoolId: { type: Schema.Types.ObjectId, ref: "schools", required: true },
    invitedByUserId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    acceptedAt: { type: Date },
    userId: { type: Schema.Types.ObjectId, ref: "users" }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

const SchoolInvitationModel = model<SchoolInvitation<Types.ObjectId>>("school-invitations", SchoolInvitationSchema);
export default SchoolInvitationModel;
