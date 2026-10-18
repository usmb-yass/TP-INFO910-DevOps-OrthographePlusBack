import { z } from 'zod';
import { Types } from 'mongoose';
import { ruleSchema as sharedRule } from '#shared/schemas/Rule/RuleSchema';

export const ruleSchema = sharedRule.extend({
    categoryId: z.string({ message: "L'ID de la catégorie est requis" }).regex(/^[0-9a-fA-F]{24}$/, { message: "ID de catégorie invalide" }).transform(val => new Types.ObjectId(val)),
});
