import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string({ message: "L'email est requis" }).email({ message: "Format d'email invalide" }),
    password: z.string({ message: "Le mot de passe est requis" }).min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    countryId: z.string({ message: "Le pays est requis" }).min(2, { message: "Code pays invalide" }),
    gradeLevelId: z.string({ message: "Le niveau est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de niveau invalide" }),
    timezone: z.string({ message: "Le fuseau horaire est requis" }),
});
