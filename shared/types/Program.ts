export default interface Program<TId = string> {
    _id: TId;
    name: string;
    gradeLevelId: TId;
    lessons: {
        lessonId: TId;
        order: number;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
