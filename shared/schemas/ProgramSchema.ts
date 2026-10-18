import { z } from 'zod';


export const programSchema = z.object({
    name: z.string({ message: "Le nom du programme est requis" }).min(1, { message: "Le nom du programme est requis" }),
    gradeLevelId: z.string({ message: "L'ID du niveau est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de niveau invalide" }),
    lessons: z.array(
        z.object({
            lessonId: z.string({ message: "L'ID de la leçon est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de leçon invalide" }),
            order: z.number({ message: "L'ordre est requis" }).int({ message: "L'ordre doit être un nombre entier" })
        })
    ).min(1, { message: "Au moins une leçon est requise" }),
});
