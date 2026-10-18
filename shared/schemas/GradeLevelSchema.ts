import { z } from 'zod';

export const gradeLevelSchema = z.object({
    level: z.number().int().min(1, { message: "Le niveau doit être un nombre entier supérieur à 0" }),
    grades: z.array(z.object({
        countryId: z.string().min(2, { message: "Le code pays est requis" }),
        name: z.string().min(1, { message: "Le nom du grade est requis" })
    })).min(1, { message: "Au moins un grade est requis" }),
});
