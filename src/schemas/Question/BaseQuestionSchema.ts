import { z } from 'zod';
import { Types } from 'mongoose';
import { baseQuestionSchema as sharedBase } from '#shared/schemas/Question/BaseQuestionSchema';

export const baseQuestionSchema = sharedBase.extend({
    ruleId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "ID de règle invalide" }).transform(val => new Types.ObjectId(val)).optional(),
});
