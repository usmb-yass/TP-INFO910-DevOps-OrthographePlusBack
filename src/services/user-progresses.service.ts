import { Types } from "mongoose";
import { UserModel, ProgramsModel, UserProgressesModel, SettingsModel, CategoriesModel, RulesModel } from "../models";
import { getDaysDifference } from "../utils/date.utils";

export const userProgressesService = {
    async checkAndResetStreak(userId: string | Types.ObjectId) {
        const user = await UserModel.findById(userId);
        if (!user || !user.progressSummary) return user;

        const timezone = user.timezone || 'UTC';
        const lastActivityAt = user.progressSummary.lastActivityAt;
        
        if (lastActivityAt) {
            const diffDays = getDaysDifference(new Date(), lastActivityAt, timezone);
            if (diffDays > 1) {
                user.progressSummary.streak = 0;
                await user.save();
            }
        }
        return user;
    },

    async updateStreakOnActivity(userId: string | Types.ObjectId) {
        const user = await UserModel.findById(userId);
        if (!user) return;

        if (!user.progressSummary) {
            user.progressSummary = { 
                streak: 0, 
                xp: 0, 
                gamificationLevel: 1, 
                dailyLessons: { count: 0 } 
            };
        }

        const timezone = user.timezone || 'UTC';
        const lastActivityAt = user.progressSummary.lastActivityAt;
        
        if (lastActivityAt) {
            const diffDays = getDaysDifference(new Date(), lastActivityAt, timezone);
            
            if (diffDays === 1) {
                user.progressSummary.streak = (user.progressSummary.streak || 0) + 1;
            } else if (diffDays > 1) {
                user.progressSummary.streak = 1;
            } else if (diffDays === 0 && user.progressSummary.streak === 0) {
                user.progressSummary.streak = 1;
            }
        } else {
            user.progressSummary.streak = 1;
        }

        user.progressSummary.lastActivityAt = new Date();
        await user.save();
    },

    async syncDailyLessonsLimit(userId: string | Types.ObjectId) {
        const user = await UserModel.findById(userId);
        if (!user) return null;

        if (!user.progressSummary) {
            user.progressSummary = { 
                streak: 0, xp: 0, gamificationLevel: 1, 
                dailyLessons: { count: 0, periodStart: new Date() } 
            };
            await user.save();
            return user;
        }

        if (!user.progressSummary.dailyLessons) {
            user.progressSummary.dailyLessons = { count: 0, periodStart: new Date() };
        }

        const timezone = user.timezone || 'UTC';
        const periodStart = user.progressSummary.dailyLessons.periodStart;

        if (periodStart) {
            const diffDays = getDaysDifference(new Date(), periodStart, timezone);
            if (diffDays !== 0) {
                user.progressSummary.dailyLessons.count = 0;
                user.progressSummary.dailyLessons.periodStart = new Date();
                await user.save();
            }
        } else {
            user.progressSummary.dailyLessons.count = 0;
            user.progressSummary.dailyLessons.periodStart = new Date();
            await user.save();
        }

        return user;
    },

    async incrementDailyLessonsCount(userId: string | Types.ObjectId) {
        const user = await this.syncDailyLessonsLimit(userId);
        if (!user) return;

        user.progressSummary.dailyLessons.count += 1;
        await user.save();
    },

    async getUserProgress(userId: string | Types.ObjectId) {
        const user = await this.syncDailyLessonsLimit(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const populateQuery = {
            path: 'currentLessonId',
            select: '-__v',
            populate: {
                path: 'rules.ruleId',
                select: '-__v -data',
                populate: {
                    path: 'categoryId',
                    select: '-__v'
                }
            }
        };

        let progress;
        if (user.currentProgressId) {
            progress = await UserProgressesModel.findById(user.currentProgressId).select('-__v').populate(populateQuery);
        } else {
            // Initialize progress if user doesn't have one
            if (!user.gradeLevelId) {
                throw new Error("User has no grade level assigned, cannot initialize progress");
            }

            // Find the program for this grade level
            const program = await ProgramsModel.findOne({ gradeLevelId: user.gradeLevelId });
            if (!program || !program.lessons || program.lessons.length === 0) {
                throw new Error("No program or lessons found for user's grade level");
            }

            // Find first lesson (sorted by order)
            const firstLesson = program.lessons.sort((a, b) => a.order - b.order)[0];

            const newProgress = new UserProgressesModel({
                userId,
                programId: program._id,
                currentLessonId: firstLesson.lessonId,
                startedAt: new Date(),
                seenCategories: [],
                seenRules: []
            });

            await newProgress.save();

            user.currentProgressId = newProgress._id;
            await user.save();

            progress = await UserProgressesModel.findById(newProgress._id).select('-__v').populate(populateQuery);
        }

        const progressResponse = progress ? progress.toObject() as any : null;
        
        const settings = await SettingsModel.findOne();
        const maxLessons = settings?.maxLessonsPerDay ?? 2;

        if (progressResponse && user.progressSummary?.dailyLessons && user.progressSummary.dailyLessons.count >= maxLessons) {
            delete progressResponse.currentLessonId;
        }

        return progressResponse;
    },



    async updateProgressAfterSession(userId: string | Types.ObjectId) {
        const user = await UserModel.findById(userId);
        if (!user || !user.currentProgressId) return null;

        const progress = await UserProgressesModel.findById(user.currentProgressId);
        if (!progress) return null;

        // Find program to get the next lesson
        const program = await ProgramsModel.findById(progress.programId);
        if (!program) return progress;

        const sortedLessons = program.lessons.sort((a, b) => a.order - b.order);
        const currentIndex = sortedLessons.findIndex(l => l.lessonId.toString() === progress.currentLessonId.toString());

        if (currentIndex !== -1 && currentIndex < sortedLessons.length - 1) {
            const nextLesson = sortedLessons[currentIndex + 1];
            progress.currentLessonId = nextLesson.lessonId;
            await progress.save();
        } else if (currentIndex === sortedLessons.length - 1) {
            // Completed program
            progress.completedAt = new Date();
            await progress.save();
        }

        return progress;
    },

    async getMySeenCategories(userId: string | Types.ObjectId) {
        const user = await UserModel.findById(userId);
        if (!user || !user.currentProgressId) return [];

        const progress = await UserProgressesModel.findById(user.currentProgressId);
        if (!progress || !progress.seenCategories || progress.seenCategories.length === 0) return [];

        // Tri par ordre d'insertion (croissant) : _id: 1
        return await CategoriesModel.find({ _id: { $in: progress.seenCategories } }).sort({ _id: 1 });
    },

    async getMySeenRules(userId: string | Types.ObjectId) {
        const user = await UserModel.findById(userId);
        if (!user || !user.currentProgressId) return [];

        const progress = await UserProgressesModel.findById(user.currentProgressId);
        if (!progress || !progress.seenRules || progress.seenRules.length === 0) return [];

        // Tri par ordre d'insertion inverse (décroissant) : _id: -1
        return await RulesModel.find({ _id: { $in: progress.seenRules } })
            .populate('categoryId')
            .sort({ _id: -1 });
    }
};
