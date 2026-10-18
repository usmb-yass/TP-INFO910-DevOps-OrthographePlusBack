export default interface UserProgress<TId = string> {
    _id: TId;
    userId: TId;
    programId: TId;
    currentLessonId: TId;
    startedAt?: Date;
    completedAt?: Date;
    seenCategories: TId[];
    seenRules: TId[];
}
