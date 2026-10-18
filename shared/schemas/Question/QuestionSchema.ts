import { z } from 'zod';
import { qcmSchema } from './QcmSchema';
import { trouSchema } from './TrouSchema';

export const questionSchema = z.discriminatedUnion('type', [qcmSchema, trouSchema]);
