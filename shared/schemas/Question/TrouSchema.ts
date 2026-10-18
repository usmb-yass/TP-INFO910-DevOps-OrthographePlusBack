import { z } from 'zod';
import QuestionType from '../../enums/QuestionType';
import { baseQuestionSchema } from './BaseQuestionSchema';

export const trouSchema = baseQuestionSchema.extend({
    type: z.literal(QuestionType.TROU),
    data: z.object({
        sentence: z.string({ message: "La phrase (sentence) est requise" }).min(1, { message: "La phrase (sentence) est requise" }),
        answer: z.array(z.string()).min(1, { message: "Au moins une réponse attendue (answer) est requise pour un texte à trou" }),
        audioUrl: z.string({ message: "Le fichier audio est requis pour les textes à trous" }).min(1, { message: "Le fichier audio est requis pour les textes à trous" })
    })
});
