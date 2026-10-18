import { z } from 'zod';

export const submitAnswerSchema = z.object({
    questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "ID de question invalide" }),
    userAnswer: z.string({ message: "La réponse de l'utilisateur est requise" }).min(1, { message: "La réponse ne peut pas être vide" }),
    duration: z.number({ message: "La durée est requise" }).int("La durée doit être un entier").min(0, { message: "La durée ne peut pas être négative" })
});
