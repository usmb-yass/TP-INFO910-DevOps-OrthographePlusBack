import { z } from 'zod';
import QuestionType from '../../enums/QuestionType';
import { baseQuestionSchema } from './BaseQuestionSchema';
import { optionSchema } from './OptionSchema';

export const qcmSchema = baseQuestionSchema.extend({
    type: z.literal(QuestionType.QCM),
    data: z.object({
        sentence: z.string({ message: "La phrase (sentence) est requise" }).min(1, { message: "La phrase (sentence) est requise" }),
        options: z.array(optionSchema).min(2, { message: "Un QCM doit avoir au moins 2 options" }),
        correctOption: z.string({ message: "L'ID de l'option correcte est requis pour un QCM" }).min(1, { message: "L'ID de l'option correcte est requis pour un QCM" })
    }).superRefine((data, ctx) => {
        if (!data.options.some(o => o.id === data.correctOption)) {
            ctx.addIssue({
                code: "custom",
                message: "L'option correcte doit correspondre à l'ID d'une des options",
                path: ['correctOption']
            });
        }
    })
});
