import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string({ message: "L'email est requis" }).email({ message: "Format d'email invalide" }),
    password: z.string({ message: "Le mot de passe est requis" }).min(1, { message: "Le mot de passe est requis" }),
});
