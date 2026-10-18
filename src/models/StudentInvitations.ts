import { Schema, model, Types } from "mongoose";
import StudentInvitation from '#shared/types/StudentInvitation';

const StudentInvitationSchema = new Schema<StudentInvitation<Types.ObjectId>>({
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "schools",
        required: true
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: "classes",
        required: true
    },
    invitedByUserId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REVOKED'],
        default: 'PENDING',
        required: true
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    acceptedByUserId: {
        type: Schema.Types.ObjectId,
        ref: "users"
    },
    acceptedAt: {
        type: Date
    }
}, {
    timestamps: true
});

const StudentInvitationModel = model<StudentInvitation<Types.ObjectId>>("student-invitations", StudentInvitationSchema);
export default StudentInvitationModel;
