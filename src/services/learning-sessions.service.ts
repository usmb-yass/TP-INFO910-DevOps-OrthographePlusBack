import { Types } from 'mongoose';
import { 
    LearningSessionsModel, 
    LessonsModel, 
    QuestionsModel,
    RulesModel,
    SettingsModel,
    UserModel,
    UserProgressesModel
} from '../models';
import LearningSessionType from '#shared/enums/LearningSession/LearningSessionType';
import LearningSessionStatus from '#shared/enums/LearningSession/LearningSessionStatus';
import { questionsService } from './questions.service';
import { userProgressesService } from './user-progresses.service';
import { gamificationService } from './gamification.service';
import { PopulatedLearningSession, PopulatedLearningSessionQuestion, SubmitAnswerResponseDto } from '#shared/dto';

/**
 * Met à jour les tableaux de règles et de catégories vues par l'utilisateur
 */
async function updateSeenRulesAndCategories(userId: Types.ObjectId, ruleId?: Types.ObjectId | null): Promise<void> {
    if (!ruleId) return;

    const rule = await RulesModel.findById(ruleId).select('categoryId');
    if (!rule) return;

    await UserProgressesModel.updateOne(
        { userId },
        { 
            $addToSet: { 
                seenRules: ruleId,
                seenCategories: rule.categoryId
            } 
        }
    );
}


/**
 * Découpe récursivement un nombre N en une somme de 2, 3 et 4 aléatoirement.
 * Utile pour créer des blocs de 2 à 4 questions.
 */
function getPartition(n: number): number[] | null {
    if (n === 0) return [];
    if (n < 2) return null;
    
    const sizes = [2, 3, 4].sort(() => Math.random() - 0.5);
    for (const size of sizes) {
        if (n - size === 0) return [size];
        if (n - size >= 2) {
            const subPart = getPartition(n - size);
            if (subPart) return [size, ...subPart];
        }
    }
    return null;
}

/**
 * Prend une liste de questions, les groupe par règle, 
 * crée des blocs de 2 à 4 questions par règle, et entrelace ces blocs.
 */
function partitionAndInterleaveQuestions(questions: any[], initialLastRuleId: string | null = null): { questionId: Types.ObjectId }[] {
    // 1. Grouper les questions par règle
    const ruleGroups = new Map<string, any[]>();
    for (const q of questions) {
        const ruleIdStr = q.ruleId?.toString() || 'unknown';
        if (!ruleGroups.has(ruleIdStr)) ruleGroups.set(ruleIdStr, []);
        ruleGroups.get(ruleIdStr)!.push(q);
    }

    // 2. Pour chaque groupe (règle), mélanger les questions et les découper en petits blocs (de 2 à 4 questions)
    const ruleBlocks: { ruleId: string; blocks: { questionId: Types.ObjectId }[][] }[] = [];
    for (const [rId, qs] of ruleGroups.entries()) {
        qs.sort(() => Math.random() - 0.5); // Mélange aléatoire des questions de la règle
        const partition = getPartition(qs.length) || [qs.length]; // Ex: si 7 questions -> [3, 4] ou [4, 3] ou [3, 2, 2]...
        
        const blocks: { questionId: Types.ObjectId }[][] = [];
        let currentIndex = 0;
        for (const size of partition) {
            blocks.push(qs.slice(currentIndex, currentIndex + size).map(q => ({ questionId: (q._id || q.questionId) as Types.ObjectId })));
            currentIndex += size;
        }
        ruleBlocks.push({ ruleId: rId, blocks });
    }

    // 3. Entrelacer les blocs de différentes règles
    const interleavedQuestions: { questionId: Types.ObjectId }[] = [];
    let lastRuleId = initialLastRuleId;

    while (ruleBlocks.some(r => r.blocks.length > 0)) {
        // Sélectionner les règles qui ont encore des blocs disponibles ET qui sont différentes de la dernière règle piochée
        const validRules = ruleBlocks.filter(r => r.blocks.length > 0 && r.ruleId !== lastRuleId);
        let chosenRule;
        
        if (validRules.length === 0) {
            // S'il ne reste plus qu'une seule règle (on est obligé de répéter la même règle), on la prend
            chosenRule = ruleBlocks.find(r => r.blocks.length > 0);
        } else {
            // Sinon, prioriser la ou les règles qui ont le plus de blocs restants pour équilibrer
            const maxBlocks = Math.max(...validRules.map(r => r.blocks.length));
            const maxRules = validRules.filter(r => r.blocks.length === maxBlocks);
            // Si plusieurs règles ont le même nombre maximum de blocs, en choisir une au hasard
            chosenRule = maxRules[Math.floor(Math.random() * maxRules.length)];
        }
        
        // Retirer un bloc de la règle choisie et l'ajouter à la liste finale
        if (chosenRule) {
            const block = chosenRule.blocks.shift();
            if (block) interleavedQuestions.push(...block);
            lastRuleId = chosenRule.ruleId; // Mettre à jour la dernière règle piochée pour éviter de la reprendre juste après
        } else {
            break;
        }
    }
    
    return interleavedQuestions;
}

export const learningSessionsService = {
    async startSession(userId: string | Types.ObjectId, data: { type: LearningSessionType, categoryIds?: string[], numberOfQuestions?: number }): Promise<PopulatedLearningSession<Types.ObjectId>> {
        const { type } = data;
        // Vérifier d'abord s'il existe déjà une session in_progress de ce type pour cet utilisateur
        const existingSession = await LearningSessionsModel.findOne({
            userId,
            type,
            status: LearningSessionStatus.IN_PROGRESS
        }).populate({
            path: 'questions.questionId',
            populate: {
                path: 'ruleId',
                select: 'name'
            }
        });

        if (type === LearningSessionType.TRAINING) {
            const isCreationRequest = data.categoryIds !== undefined && data.numberOfQuestions !== undefined;
            
            if (isCreationRequest && existingSession) {
                throw new Error("TRAINING_ALREADY_EXISTS");
            }
            if (!isCreationRequest && !existingSession) {
                throw new Error("TRAINING_NOT_FOUND");
            }
        }

        if (existingSession && (type !== LearningSessionType.TRAINING || (data.categoryIds === undefined && data.numberOfQuestions === undefined))) {
            const sessionObj = existingSession.toObject();
            sessionObj.questions = sessionObj.questions.map((q: any) => {
                const { questionId, ...rest } = q;
                const rule = questionId?.ruleId ? { name: questionId.ruleId.name } : undefined;
                if (questionId?.ruleId) {
                    questionId.ruleId = questionId.ruleId._id;
                }
                return { ...rest, question: questionId, rule };
            });
            return sessionObj as unknown as PopulatedLearningSession<Types.ObjectId>;
        }

        // Si c'est une leçon du jour
        if (type === LearningSessionType.DAILY_LESSON) {

            const userProgress = await userProgressesService.getUserProgress(userId);
            if (!userProgress || !userProgress.currentLessonId) {
                throw new Error("Impossible de trouver la leçon actuelle de l'utilisateur.");
            }

            const lesson = await LessonsModel.findById(userProgress.currentLessonId);
            if (!lesson) {
                throw new Error("Leçon introuvable.");
            }

            const settings = await SettingsModel.findOne();
            const numberOfQuestionsPerRule = settings?.numberOfQuestionsPerRule ?? 7;

            // Récupérer toutes les questions
            const allQuestions: any[] = [];
            for (const ruleObj of lesson.rules) {
                const randomQuestions = await questionsService.getRandomQuestionsByRule(ruleObj.ruleId as unknown as Types.ObjectId, numberOfQuestionsPerRule);
                allQuestions.push(...randomQuestions);
            }

            // Utiliser la fonction partagée pour partitionner et entrelacer
            const finalQuestions = partitionAndInterleaveQuestions(allQuestions);

            // Calculer attemptNumber
            const lastSession = await LearningSessionsModel.findOne({
                userId,
                lessonId: lesson._id,
                type
            }).sort({ attemptNumber: -1 }).lean();
            const nextAttemptNumber = lastSession && lastSession.attemptNumber ? lastSession.attemptNumber + 1 : 1;

            // Créer la nouvelle session
            const newSession = new LearningSessionsModel({
                userId,
                userProgressId: userProgress._id,
                type,
                lessonId: lesson._id,
                status: LearningSessionStatus.IN_PROGRESS,
                questions: finalQuestions,
                currentQuestionIndex: 0,
                attemptNumber: nextAttemptNumber,
                duration: 0,
                startedAt: new Date()
            });

            await newSession.save();
            await userProgressesService.updateStreakOnActivity(userId);
            await newSession.populate({
                path: 'questions.questionId',
                populate: {
                    path: 'ruleId',
                    select: 'name'
                }
            });
            
            const sessionObj = newSession.toObject();
            sessionObj.questions = sessionObj.questions.map((q: any) => {
                const { questionId, ...rest } = q;
                const rule = questionId?.ruleId ? { name: questionId.ruleId.name } : undefined;
                if (questionId?.ruleId) {
                    questionId.ruleId = questionId.ruleId._id;
                }
                return { ...rest, question: questionId, rule };
            });
            return sessionObj as unknown as PopulatedLearningSession<Types.ObjectId>;
        }

        // Si c'est un entrainement (création)
        if (type === LearningSessionType.TRAINING) {
            const { categoryIds, numberOfQuestions } = data;
            
            if (!categoryIds || categoryIds.length === 0 || !numberOfQuestions) {
                throw new Error("Paramètres manquants ou invalides pour la création de l'entraînement.");
            }

            const user = await UserModel.findById(userId);
            if (!user || !user.currentProgressId) {
                throw new Error("Utilisateur ou progression introuvable.");
            }

            const progress = await UserProgressesModel.findById(user.currentProgressId);
            if (!progress) {
                throw new Error("Progression introuvable.");
            }

            const seenCategoriesStr = progress.seenCategories.map((c: any) => c.toString());
            const hasUnseenCategory = categoryIds.some((id: string) => !seenCategoriesStr.includes(id.toString()));

            if (hasUnseenCategory) {
                throw new Error("UNSEEN_CATEGORIES");
            }

            const rules = await RulesModel.find({ 
                categoryId: { $in: categoryIds as any[] },
                _id: { $in: progress.seenRules }
            });
            if (rules.length === 0) {
                throw new Error("Aucune règle trouvée pour ces catégories.");
            }

            const baseCount = Math.floor(numberOfQuestions / rules.length);
            let remainder = numberOfQuestions % rules.length;

            const allQuestions: any[] = [];
            for (const ruleObj of rules) {
                let count = baseCount;
                if (remainder > 0) {
                    count++;
                    remainder--;
                }
                
                if (count > 0) {
                    const randomQuestions = await questionsService.getRandomQuestionsByRule(ruleObj._id as Types.ObjectId, count);
                    allQuestions.push(...randomQuestions);
                }
            }

            const finalQuestions = partitionAndInterleaveQuestions(allQuestions);

            const newSession = new LearningSessionsModel({
                userId,
                type,
                status: LearningSessionStatus.IN_PROGRESS,
                questions: finalQuestions,
                currentQuestionIndex: 0,
                attemptNumber: 1,
                duration: 0,
                startedAt: new Date()
            });

            await newSession.save();
            await userProgressesService.updateStreakOnActivity(userId);
            await newSession.populate({
                path: 'questions.questionId',
                populate: { path: 'ruleId', select: 'name' }
            });
            
            const sessionObj = newSession.toObject();
            sessionObj.questions = sessionObj.questions.map((q: any) => {
                const { questionId, ...rest } = q;
                const rule = questionId?.ruleId ? { name: questionId.ruleId.name } : undefined;
                if (questionId?.ruleId) {
                    questionId.ruleId = questionId.ruleId._id;
                }
                return { ...rest, question: questionId, rule };
            });
            return sessionObj as unknown as PopulatedLearningSession<Types.ObjectId>;
        }

        throw new Error("Type de session non supporté pour la création automatique.");
    },

    async submitAnswer(sessionId: string | Types.ObjectId, questionId: string | Types.ObjectId, userAnswer: string, duration: number): Promise<SubmitAnswerResponseDto<Types.ObjectId>> {
        const session = await LearningSessionsModel.findById(sessionId);
        if (!session) throw new Error("Session introuvable.");
        if (session.status !== LearningSessionStatus.IN_PROGRESS) {
            throw new Error("Cette session n'est plus en cours.");
        }

        const qIndex = session.currentQuestionIndex || 0;
        const currentQ = session.questions[qIndex];

        if (!currentQ || currentQ.questionId.toString() !== questionId.toString()) {
            throw new Error("L'ID de la question ne correspond pas à la question en cours.");
        }

        // Vérifier si la réponse est correcte
        const questionDoc = await QuestionsModel.findById(questionId);
        if (!questionDoc) throw new Error("Question introuvable dans la base.");

        let isCorrect = false;
        let correctAnswer = '';
        if (questionDoc.type === 'QCM') {
            const qcmData = questionDoc.data as any;
            isCorrect = qcmData.correctOption === userAnswer;
            const correctOptObj = qcmData.options.find((o: any) => o.id === qcmData.correctOption);
            correctAnswer = correctOptObj ? correctOptObj.text : qcmData.correctOption;
        } else if (questionDoc.type === 'TROU') {
            const possibleAnswers = (questionDoc.data as any).answer as string[];
            isCorrect = possibleAnswers.some(ans => ans.toLowerCase().trim() === userAnswer.toLowerCase().trim());
            correctAnswer = possibleAnswers.length > 0 ? possibleAnswers[0] : '';
        }

        let ruleExplanation = undefined;
        if (questionDoc.ruleId) {
            const rule = await RulesModel.findById(questionDoc.ruleId);
            if (rule && rule.data && rule.data.explanation) {
                ruleExplanation = rule.data.explanation;
            }
        }

        // Mettre à jour la question dans la session
        currentQ.userAnswer = userAnswer;
        currentQ.isCorrect = isCorrect;
        currentQ.answeredAt = new Date();

        // Mettre à jour la durée de la session
        session.duration = duration;

        let questionsUpdated = false;
        
        if (!isCorrect && questionDoc.ruleId && session.type === LearningSessionType.DAILY_LESSON) {
            const wrongAnswers = session.questions.filter(q => q.isCorrect === false);
            const wrongQuestionIds = wrongAnswers.map(q => q.questionId);
            const wrongQuestionsDb = await QuestionsModel.find({ _id: { $in: wrongQuestionIds as any[] } });
            
            const ruleErrorCount = wrongQuestionsDb.filter(q => q.ruleId?.toString() === questionDoc.ruleId?.toString()).length;
            
            if (ruleErrorCount === 2) {
                const currentSessionQuestionIds = session.questions.map(q => q.questionId);
                const newQuestions = await questionsService.getRandomQuestionsByRule(
                    questionDoc.ruleId as unknown as Types.ObjectId, 
                    4, 
                    currentSessionQuestionIds as unknown as Types.ObjectId[]
                );
                
                if (newQuestions.length > 0) {
                    const unansweredQuestions = session.questions.slice(qIndex + 1);
                    const unansweredQuestionIds = unansweredQuestions.map(q => q.questionId);
                    const unansweredQuestionsDb = await QuestionsModel.find({ _id: { $in: unansweredQuestionIds as any[] } });
                    
                    const combinedQuestionsDb = [...unansweredQuestionsDb, ...newQuestions];
                    
                    const interleavedQuestions = partitionAndInterleaveQuestions(
                        combinedQuestionsDb, 
                        questionDoc.ruleId.toString()
                    );
                    
                    // Remplacer les questions non répondues par la nouvelle suite entrelacée
                    session.questions.splice(qIndex + 1, session.questions.length - (qIndex + 1), ...interleavedQuestions as any);
                    questionsUpdated = true;
                }
            }
        }

        // Incrémenter l'index si ce n'est pas la dernière question
        if (qIndex < session.questions.length - 1) {
            session.currentQuestionIndex = qIndex + 1;
        }

        await session.save();
        await userProgressesService.updateStreakOnActivity(session.userId);
        
        // Mettre à jour les règles et catégories vues si applicable (hors entraînement)
        if (session.type !== LearningSessionType.TRAINING && questionDoc.ruleId) {
            await updateSeenRulesAndCategories(session.userId, questionDoc.ruleId as unknown as Types.ObjectId);
        }

        let newQuestions: PopulatedLearningSessionQuestion<Types.ObjectId>[] | undefined = undefined;
        if (questionsUpdated) {
            await session.populate({
                path: 'questions.questionId',
                populate: { path: 'ruleId', select: 'name' }
            });
            const sessionObj = session.toObject();
            const populatedQuestions = sessionObj.questions.map((q: any) => {
                const { questionId, ...rest } = q;
                const rule = questionId?.ruleId ? { name: questionId.ruleId.name } : undefined;
                if (questionId?.ruleId) {
                    questionId.ruleId = questionId.ruleId._id;
                }
                return { ...rest, question: questionId, rule };
            });
            newQuestions = populatedQuestions as unknown as PopulatedLearningSessionQuestion<Types.ObjectId>[];
        }

        return { session, isCorrect, correctAnswer, ruleExplanation, newQuestions };
    },

    async finishSession(sessionId: string | Types.ObjectId) {
        const session = await LearningSessionsModel.findById(sessionId);
        if (!session) throw new Error("Session introuvable.");
        if (session.status === LearningSessionStatus.COMPLETED) {
            return session;
        }

        // Calcul du score
        const totalQuestions = session.questions.length;
        const correctAnswers = session.questions.filter(q => q.isCorrect).length;
        const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

        session.scorePercentage = scorePercentage;
        session.completedAt = new Date();
        session.status = LearningSessionStatus.COMPLETED;

        let minScore = 70;

        // Validation de la session (isPassed)
        if (session.type === LearningSessionType.DAILY_LESSON && session.lessonId) {
            const lesson = await LessonsModel.findById(session.lessonId);
            if (lesson && lesson.minScore !== undefined) {
                minScore = lesson.minScore;
            }
            session.isPassed = scorePercentage >= minScore;

            if (session.isPassed) {
                // Incrémenter le compteur de leçons journalières
                await userProgressesService.incrementDailyLessonsCount(session.userId);
                
                // Faire avancer l'utilisateur à la leçon suivante
                await userProgressesService.updateProgressAfterSession(session.userId);
            }
        }

        // Calcul des gains d'XP
        const user = await userProgressesService.syncDailyLessonsLimit(session.userId);
        if (user && user.progressSummary) {
            // Si la session est validée, count a déjà été incrémenté. Donc count === 2 veut dire que c'est la 2ème leçon.
            const isSecondLessonOfDay = (session.type === LearningSessionType.DAILY_LESSON && session.isPassed && user.progressSummary.dailyLessons.count === 2) || false;
            
            const xpGains = gamificationService.calculateSessionXp(
                session.type,
                session.isPassed ?? true,
                scorePercentage,
                minScore,
                isSecondLessonOfDay
            );

            session.xpGained = xpGains;

            // Mise à jour de l'utilisateur
            const totalXpGained = xpGains.reduce((acc, gain) => acc + gain.amount, 0);
            user.progressSummary.xp += totalXpGained;
            user.progressSummary.gamificationLevel = gamificationService.calculateLevel(user.progressSummary.xp);
            await user.save();
        }

        await session.save();
        await userProgressesService.updateStreakOnActivity(session.userId);
        
        return session;
    },

    async deleteCurrentTraining(userId: string | Types.ObjectId): Promise<void> {
        const deleted = await LearningSessionsModel.findOneAndDelete({
            userId,
            type: LearningSessionType.TRAINING,
            status: LearningSessionStatus.IN_PROGRESS
        });
        
        if (!deleted) {
            throw new Error("Aucun entraînement en cours n'a été trouvé pour cet utilisateur.");
        }
    }
};
