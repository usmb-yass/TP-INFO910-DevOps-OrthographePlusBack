export default interface UserStat<TId = string> {
    globalProgression: {
        lastCompletedLessonNumber: number;
        totalLessons: number;
    };
    categories: {
        seen: number;
        total: number;
    };
    rules: {
        seen: number;
        total: number;
    };
    attemptsByLesson: {
        [lessonId: string]: {
            minScore: number;
            attempts: {
                sessionId: TId;
                attemptNumber: number;
                scorePercentage?: number;
                errorCount: number;
                totalQuestions: number;
                startedAt: Date;
                completedAt?: Date;
            }[];
        };
    };
    mistakesEvolution: {
        dataPoints: {
            sessionIndex: number;
            faultCount: number;
            startedAt: Date;
        }[];
        improvement: {
            percentage: number;
            absoluteReduction: number;
            firstFaultCount: number;
            lastFaultCount: number;
        };
    };
}
