import { z } from 'zod';
import { RuleDataSchema } from './RuleDataSchema';

export const ruleSchema = z.object({
    name: z.string({ message: "Le nom de la règle est requis" }).min(1, { message: "Le nom de la règle est requis" }),
    data: RuleDataSchema,
    categoryId: z.string({ message: "L'ID de la catégorie est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de catégorie invalide" }),
});
