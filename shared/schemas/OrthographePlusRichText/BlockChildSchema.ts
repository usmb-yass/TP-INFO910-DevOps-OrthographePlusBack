import { z } from 'zod';
import { SpanSchema } from './SpanSchema';

export const BlockChildSchema = z.discriminatedUnion('_type', [
  SpanSchema,
]);
