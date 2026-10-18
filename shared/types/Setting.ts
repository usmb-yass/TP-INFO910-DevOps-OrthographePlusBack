import DailyResetType from "../enums/DailyResetType";

export default interface Setting {
    _id: string; // usually 'global_limits'
    maxLessonsPerDay: number;
    numberOfQuestionsPerRule: number;
    dailyReset: {
        type: DailyResetType;
        time?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
