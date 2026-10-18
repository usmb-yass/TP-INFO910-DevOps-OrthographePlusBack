import { Schema, model, Types } from "mongoose";
import User from '#shared/types/User';
import { Role } from '#shared/enums/Role';

const UserSchema = new Schema<User<Types.ObjectId>>({
    email: {
        type: String,
        index: { unique: true },
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String, 
    },
    profilePicture: {
        type: String,
        required: true,
        default: "default.png"
    },
    role: {
        type: String,
        enum: Object.values(Role),
        required: true
    },
    schoolId: {
        type: Schema.Types.ObjectId,
        ref: "schools",
    },
    classId: {
        type: Schema.Types.ObjectId,
        ref: "classes",
    },
    isSchoolLicense: {
        type: Boolean,
        default: false
    },
    countryId: {
        type: String,
        ref: "countries"
    },
    gradeLevelId: {
        type: Schema.Types.ObjectId,
        ref: "grade-levels"
    },
    timezone: {
        type: String
    },
    currentProgressId: {
        type: Schema.Types.ObjectId,
        ref: "user-progresses"
    },
    progressSummary: {
        streak: {
            type: Number,
            default: 0
        },
        lastActivityAt: {
            type: Date
        },
        xp: {
            type: Number,
            default: 0
        },
        gamificationLevel: {
            type: Number,
            default: 1
        },
        dailyLessons: {
            count: { type: Number, default: 0 },
            periodStart: { type: Date }
        }
    },
    totalConnectionDuration: {
        type: Number,
        default: 0
    },
    passwordHash: {
        type: String,
        required: true,
        select: false,
    },
    saltHash: {
        type: String,
        required: true,
        select: false,
    },
    passwordMetadata: {
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        }
    }
},
{
    timestamps: { createdAt: true, updatedAt: false },
});

UserSchema.index({ email: "text", firstName: "text", lastName: "text" });

const UserModel = model<User<Types.ObjectId>>("users", UserSchema);
export default UserModel;