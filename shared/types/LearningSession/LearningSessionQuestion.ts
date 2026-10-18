export default interface LearningSessionQuestion<TId = string> {
    questionId: TId;
    userAnswer?: string;
    isCorrect?: boolean;
    answeredAt?: Date;
}
