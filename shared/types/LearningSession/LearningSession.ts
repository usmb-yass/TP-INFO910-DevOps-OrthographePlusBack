import LearningSessionQuestion from "./LearningSessionQuestion";
import LearningSessionType from "../../enums/LearningSession/LearningSessionType";
import LearningSessionStatus from "../../enums/LearningSession/LearningSessionStatus";

export default interface LearningSession<TId = string> {
    _id: TId;
    userId: TId;
    userProgressId?: TId;
    type: LearningSessionType;
    status: LearningSessionStatus;
    lessonId?: TId;
    attemptNumber?: number;
    scorePercentage?: number;
    isPassed?: boolean;
    currentQuestionIndex?: number;
    duration: number;
    questions: LearningSessionQuestion<TId>[];
    startedAt?: Date;
    completedAt?: Date;
    xpGained?: { type: string; amount: number }[];
}
