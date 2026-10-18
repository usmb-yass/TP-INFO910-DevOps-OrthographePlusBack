import { z } from 'zod';

export const TextColorMarkDefSchema = z.object({
  _key: z.string(),
  _type: z.literal('textColor'),
  value: z.string(),
});
