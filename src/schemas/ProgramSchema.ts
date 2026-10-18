import { z } from 'zod';
import { Types } from 'mongoose';
import { programSchema as sharedProgram } from '#shared/schemas/ProgramSchema';

export const programSchema = sharedProgram.extend({
    gradeLevelId: z.string({ message: "L'ID du niveau est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de niveau invalide" }).transform(val => new Types.ObjectId(val)),
    lessons: z.array(
        z.object({
            lessonId: z.string({ message: "L'ID de la leçon est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de leçon invalide" }).transform(val => new Types.ObjectId(val)),
            order: z.number({ message: "L'ordre est requis" }).int({ message: "L'ordre doit être un nombre entier" })
        })
    ).min(1, { message: "Au moins une leçon est requise" }),
});
