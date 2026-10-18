import gamificationConfig from '../../shared/gamification.json';
import LearningSessionType from '#shared/enums/LearningSession/LearningSessionType';

export type XpGain = {
    type: string;
    amount: number;
};

export const gamificationService = {
    /**
     * Calcule le niveau de gamification en fonction de l'XP total.
     */
    calculateLevel(totalXp: number): number {
        let currentLevel = 1;
        let remainingXp = totalXp;
        
        while (true) {
            // Trouver l'XP requis pour passer au niveau suivant (ex: clé "1" pour passer du niveau 1 au 2)
            const requiredStr = gamificationConfig.levels[currentLevel.toString() as keyof typeof gamificationConfig.levels] 
                || gamificationConfig.levels.default;
            
            const requiredXp = Number(requiredStr);

            if (remainingXp >= requiredXp) {
                remainingXp -= requiredXp;
                currentLevel++;
            } else {
                break;
            }
        }
        
        return currentLevel;
    },

    /**
     * Calcule les gains d'XP (base + bonus) pour une session donnée.
     */
    calculateSessionXp(
        sessionType: LearningSessionType, 
        isPassed: boolean, 
        scorePercentage: number, 
        minScore: number, 
        isSecondLessonOfDay: boolean
    ): XpGain[] {
        const gains: XpGain[] = [];
        const { rewards } = gamificationConfig;

        if (sessionType === LearningSessionType.TRAINING) {
            // Entraînement : gain fixe de base, pas de bonus de performance
            gains.push({
                type: 'BASE_TRAINING',
                amount: rewards.training.base
            });
            return gains;
        }

        // Leçon journalière
        if (!isPassed) {
            // Échec
            gains.push({
                type: 'FAIL_LESSON',
                amount: rewards.dailyLesson.fail
            });
            return gains;
        }

        // Succès
        gains.push({
            type: 'BASE_LESSON',
            amount: rewards.dailyLesson.base
        });

        // Bonus 2ème leçon
        if (isSecondLessonOfDay) {
            gains.push({
                type: 'SECOND_LESSON_BONUS',
                amount: rewards.dailyLesson.secondLessonBonus
            });
        }

        // Bonus de performance
        if (scorePercentage > minScore && scorePercentage <= 100) {
            const range = 100 - minScore;
            if (range > 0) {
                const step = range / rewards.performance.tiersCount; // Ex: si 70%, range = 30, step = 6
                
                // Nombre de paliers franchis (ex: score 82%, minScore 70% -> (82-70)/6 = 2)
                const tiersGained = Math.floor((scorePercentage - minScore) / step);
                
                if (tiersGained > 0) {
                    const cappedTiers = Math.min(tiersGained, rewards.performance.tiersCount);
                    gains.push({
                        type: 'PERFORMANCE_BONUS',
                        amount: cappedTiers * rewards.performance.xpPerTier
                    });
                }
            }
        }

        return gains;
    }
};
