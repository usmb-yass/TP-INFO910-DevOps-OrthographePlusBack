import { z } from 'zod';
import { TextColorMarkDefSchema } from './TextColorMarkDefSchema';

export const MarkDefSchema = z.discriminatedUnion('_type', [
  TextColorMarkDefSchema,
]);
