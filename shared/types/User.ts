import { Role } from "../enums/Role";

export default interface User<TId = string> {
    _id: TId;
    email: string;
    firstName?: string;
    lastName?: string;
    profilePicture: string;
    role: Role;
    schoolId?: TId;
    classId?: TId;
    isSchoolLicense?: boolean;
    countryId?: string;
    gradeLevelId?: TId;
    timezone?: string;
    currentProgressId?: TId;
    progressSummary: {
        streak: number;
        lastActivityAt?: Date;
        xp: number;
        gamificationLevel: number;
        dailyLessons: {
            count: number;
            periodStart?: Date;
        };
    };
    totalConnectionDuration?: number;
    passwordMetadata: {
        resetPasswordToken?: string;
        resetPasswordExpires?: Date;
    };
    passwordHash: string;
    saltHash: string;
    createdAt?: Date;
}