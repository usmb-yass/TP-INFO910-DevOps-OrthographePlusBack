import { Types } from 'mongoose';
import { updateQuestionSchema as sharedUpdateQuestionSchema } from '#shared/schemas/Question/UpdateQuestionSchema';

export const updateQuestionSchema = sharedUpdateQuestionSchema.transform(val => ({
    ...val,
    ruleId: val.ruleId ? new Types.ObjectId(val.ruleId) : (val.ruleId as null | undefined)
}));
