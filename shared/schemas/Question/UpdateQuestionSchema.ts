import { z } from 'zod';
import { qcmSchema } from './QcmSchema';
import { trouSchema } from './TrouSchema';
import { baseQuestionSchema } from './BaseQuestionSchema';

export const updateQuestionSchema = z.union([
    // Cas 1 : On modifie le contenu ou le type -> Validation stricte requise
    z.discriminatedUnion('type', [
        qcmSchema.partial().required({ type: true }),
        trouSchema.partial().required({ type: true })
    ]),
    
    // Cas 2 : On ne touche qu'aux métadonnées communes -> Pas de "type" ni de "data" autorisés ici
    baseQuestionSchema.partial().extend({
        type: z.undefined().optional(),
        data: z.undefined().optional()
    })
]);
