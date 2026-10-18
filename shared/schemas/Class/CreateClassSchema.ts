import { z } from 'zod';

export const createClassSchema = z.object({
    name: z.string({ message: "Le nom de la classe est requis" }),
    gradeLevelId: z.string({ message: "Le niveau est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de niveau invalide" })
});
