import { z } from 'zod';

export const SpanSchema = z.object({
  _type: z.literal('span'),
  text: z.string(),
  marks: z.array(z.string()).optional(), 
});
