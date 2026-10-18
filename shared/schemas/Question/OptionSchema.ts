import { z } from 'zod';

export const optionSchema = z.object({
    id: z.string({ message: "L'ID de l'option est requis" }).min(1, { message: "L'ID de l'option ne peut pas être vide" }),
    text: z.string({ message: "Le texte de l'option est requis" }).min(1, { message: "Le texte de l'option ne peut pas être vide" })
});
