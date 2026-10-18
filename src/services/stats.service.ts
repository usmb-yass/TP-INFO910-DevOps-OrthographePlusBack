import { Types } from 'mongoose';
import UserProgressesModel from '../models/UserProgresses';
import ProgramsModel from '../models/Programs';
import RulesModel from '../models/Rules';
import LearningSessionsModel from '../models/LearningSessions/LearningSessions';
import QuestionsModel from '../models/Questions/Questions';
import LearningSessionType from '#shared/enums/LearningSession/LearningSessionType';
import LearningSessionStatus from '#shared/enums/LearningSession/LearningSessionStatus';
import UserStat from '#shared/types/UserStat';

export const statsService = {
    async getMyStats(userId: string | Types.ObjectId): Promise<UserStat<Types.ObjectId>> {
        // 1. Fetch user progress
        const userProgress = await UserProgressesModel.findOne({ userId }).lean();
        if (!userProgress) {
            throw new Error('User progress not found');
        }

        // 2. Fetch program with lessons
        const program = await ProgramsModel.findById(userProgress.programId)
            .populate({
                path: 'lessons.lessonId',
                select: 'rules minScore'
            })
            .lean();

        if (!program) {
            throw new Error('Program not found');
        }

        // 3. Compute global progression
        let lastCompletedLessonNumber = 0;
        const totalLessons = program.lessons.length;

        if (userProgress.completedAt) {
            lastCompletedLessonNumber = totalLessons;
        } else if (userProgress.currentLessonId) {
            const currentIndex = program.lessons.findIndex(
                (l) => l.lessonId && (l.lessonId as any)._id.toString() === userProgress.currentLessonId!.toString()
            );
            if (currentIndex > -1) {
                lastCompletedLessonNumber = currentIndex; // If on index 3, completed 0, 1, 2 => 3 lessons completed. The 3rd lesson is number 3.
            }
        }

        const globalProgression = {
            lastCompletedLessonNumber,
            totalLessons
        };

        // 4. Compute unique rules and categories in the program, and fetch minScores
        const uniqueRuleIds = new Set<string>();
        const lessonMinScores: Record<string, number> = {};

        for (const lessonItem of program.lessons) {
            const lesson = lessonItem.lessonId as any; // Populated lesson
            if (lesson) {
                lessonMinScores[lesson._id.toString()] = lesson.minScore ?? 70;
                if (lesson.rules) {
                    for (const ruleItem of lesson.rules) {
                        if (ruleItem.ruleId) {
                            uniqueRuleIds.add(ruleItem.ruleId.toString());
                        }
                    }
                }
            }
        }

        const totalRulesInProgram = uniqueRuleIds.size;
        
        // Find categories for these rules
        const rules = await RulesModel.find({ _id: { $in: Array.from(uniqueRuleIds) } }).select('categoryId').lean();
        const uniqueCategoryIds = new Set<string>();
        for (const r of rules) {
            if (r.categoryId) {
                uniqueCategoryIds.add(r.categoryId.toString());
            }
        }

        const totalCategoriesInProgram = uniqueCategoryIds.size;

        const categoriesStats = {
            seen: userProgress.seenCategories.length,
            total: totalCategoriesInProgram
        };

        const rulesStats = {
            seen: userProgress.seenRules.length,
            total: totalRulesInProgram
        };

        // 5. Compute learning sessions stats (scorePercentage, errors, questions)
        const learningSessions = await LearningSessionsModel.find({ 
            userId,
            lessonId: { $exists: true, $ne: null }
        }).lean();

        const attemptsByLesson: Record<string, { minScore: number, attempts: any[] }> = {};

        for (const session of learningSessions) {
            const lessonIdStr = session.lessonId!.toString();
            
            let errorCount = 0;
            const totalQuestions = session.questions ? session.questions.length : 0;
            
            if (session.questions) {
                for (const q of session.questions) {
                    if (q.isCorrect === false) {
                        errorCount++;
                    }
                }
            }

            if (!attemptsByLesson[lessonIdStr]) {
                attemptsByLesson[lessonIdStr] = {
                    minScore: lessonMinScores[lessonIdStr] ?? 70,
                    attempts: []
                };
            }

            attemptsByLesson[lessonIdStr].attempts.push({
                sessionId: session._id,
                attemptNumber: session.attemptNumber,
                scorePercentage: session.scorePercentage,
                errorCount,
                totalQuestions,
                startedAt: session.startedAt,
                completedAt: session.completedAt
            });
        }

        // 6. Compute mistakes evolution for daily lessons (fault count per rule)
        const dailySessions = await LearningSessionsModel.find({
            userId,
            type: LearningSessionType.DAILY_LESSON,
            status: LearningSessionStatus.COMPLETED
        }).sort({ startedAt: 1 }).lean();

        const dataPoints: { sessionIndex: number; faultCount: number; startedAt: Date }[] = [];

        for (let i = 0; i < dailySessions.length; i++) {
            const session = dailySessions[i];
            if (!session.questions || session.questions.length === 0) {
                dataPoints.push({ sessionIndex: i + 1, faultCount: 0, startedAt: session.startedAt! });
                continue;
            }

            // Get incorrect question IDs
            const incorrectQuestionIds = session.questions
                .filter(q => q.isCorrect === false)
                .map(q => q.questionId);

            if (incorrectQuestionIds.length === 0) {
                dataPoints.push({ sessionIndex: i + 1, faultCount: 0, startedAt: session.startedAt! });
                continue;
            }

            // Fetch questions to get their ruleId
            const questionsDb = await QuestionsModel.find({
                _id: { $in: incorrectQuestionIds as any[] }
            }).select('_id ruleId').lean();

            // Group distinct questionIds by ruleId
            const faultsByRule = new Map<string, Set<string>>();
            for (const q of questionsDb) {
                const ruleIdStr = q.ruleId?.toString() || 'unknown';
                if (!faultsByRule.has(ruleIdStr)) {
                    faultsByRule.set(ruleIdStr, new Set());
                }
                faultsByRule.get(ruleIdStr)!.add(q._id.toString());
            }

            // Total fault count = sum of distinct questionIds per rule
            let faultCount = 0;
            for (const questionIds of faultsByRule.values()) {
                faultCount += questionIds.size;
            }

            dataPoints.push({ sessionIndex: i + 1, faultCount, startedAt: session.startedAt! });
        }

        // Calculate improvement (first vs last)
        let improvement = {
            percentage: 0,
            absoluteReduction: 0,
            firstFaultCount: 0,
            lastFaultCount: 0
        };

        if (dataPoints.length >= 2) {
            const firstFaultCount = dataPoints[0].faultCount;
            const lastFaultCount = dataPoints[dataPoints.length - 1].faultCount;
            const absoluteReduction = firstFaultCount - lastFaultCount;
            const percentage = firstFaultCount > 0
                ? Math.round((absoluteReduction / firstFaultCount) * 100)
                : 0;

            improvement = {
                percentage,
                absoluteReduction,
                firstFaultCount,
                lastFaultCount
            };
        }

        const mistakesEvolution = { dataPoints, improvement };

        return {
            globalProgression,
            categories: categoriesStats,
            rules: rulesStats,
            attemptsByLesson,
            mistakesEvolution
        };
    }
};
