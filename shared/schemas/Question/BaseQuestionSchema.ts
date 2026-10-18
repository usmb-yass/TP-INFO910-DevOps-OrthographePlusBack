import { z } from 'zod';

export const baseQuestionSchema = z.object({
    ruleId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "ID de règle invalide" }).optional(),
    isDisabled: z.boolean().optional(),
});
