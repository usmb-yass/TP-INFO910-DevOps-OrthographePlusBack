import LessonType from "../enums/LessonType";

export default interface Lesson<TId = string> {
    _id: TId;
    name: string;
    type: LessonType;
    rules: {
        ruleId: TId;
        order: number;
    }[];
    minScore: number;
    createdAt: Date;
    updatedAt: Date;
}
