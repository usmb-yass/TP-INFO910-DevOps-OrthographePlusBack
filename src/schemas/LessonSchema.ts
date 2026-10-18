import { z } from 'zod';
import { Types } from 'mongoose';
import { lessonSchema as sharedLesson } from '#shared/schemas/LessonSchema';

export const lessonSchema = sharedLesson.extend({
    rules: z.array(
        z.object({
            ruleId: z.string({ message: "L'ID de la règle est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de règle invalide" }).transform(val => new Types.ObjectId(val)),
            order: z.number({ message: "L'ordre est requis" }).int({ message: "L'ordre doit être un entier" })
        })
    ).min(1, { message: "Au moins une règle est requise" })
});
