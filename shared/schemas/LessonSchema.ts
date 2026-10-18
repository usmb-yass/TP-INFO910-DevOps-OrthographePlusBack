import { z } from 'zod';
import LessonType from '../enums/LessonType';

export const lessonSchema = z.object({
    name: z.string({ message: "Le nom de la leçon est requis" }).min(1, { message: "Le nom de la leçon est requis" }),
    type: z.nativeEnum(LessonType, { message: "Le type doit être 'NORMAL' ou 'REVIEW'" }),
    rules: z.array(
        z.object({
            ruleId: z.string({ message: "L'ID de la règle est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de règle invalide" }),
            order: z.number({ message: "L'ordre est requis" }).int({ message: "L'ordre doit être un entier" })
        })
    ).min(1, { message: "Au moins une règle est requise" }),
    minScore: z.number({ message: "Le score minimum est requis" }).int({ message: "Le score minimum doit être un entier" }).min(0, { message: "Le score minimum doit être au moins 0" }).max(100, { message: "Le score minimum doit être au maximum 100" }).optional(),
});
