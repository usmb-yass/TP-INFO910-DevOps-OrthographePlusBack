import { Types } from 'mongoose';
import { questionSchema as sharedQuestionSchema } from '#shared/schemas/Question/QuestionSchema';

export const questionSchema = sharedQuestionSchema.transform(val => ({
    ...val,
    ruleId: val.ruleId ? new Types.ObjectId(val.ruleId) : (val.ruleId as null | undefined)
}));
