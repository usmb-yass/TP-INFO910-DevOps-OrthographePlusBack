import { z } from 'zod';
import LearningSessionType from '../../enums/LearningSession/LearningSessionType';

const dailyLessonSchema = z.object({
    type: z.literal(LearningSessionType.DAILY_LESSON)
});

const trainingResumeSchema = z.object({
    type: z.literal(LearningSessionType.TRAINING)
}).strict();

const trainingCreationSchema = z.object({
    type: z.literal(LearningSessionType.TRAINING),
    categoryIds: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "ID de catégorie invalide" })
    ).min(1, { message: "Les catégories sont obligatoires pour un entraînement." }),
    numberOfQuestions: z.number({ message: "Le nombre de questions est obligatoire pour un entraînement." }).int().min(1)
});

// Note: On ne peut pas utiliser z.discriminatedUnion('type') pour les 3 schémas
// car Zod v4 interdit d'avoir des valeurs de discriminant dupliquées (ici TRAINING).
// On utilise donc z.union qui va tester les schémas séquentiellement.
export const startSessionSchema = z.union([
    dailyLessonSchema,
    trainingResumeSchema,
    trainingCreationSchema
], { error: "Le format de la requête est invalide." });
