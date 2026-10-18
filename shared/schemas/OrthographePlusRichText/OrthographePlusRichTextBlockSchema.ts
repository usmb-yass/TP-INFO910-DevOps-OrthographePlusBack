import { z } from 'zod';
import { BlockChildSchema } from './BlockChildSchema';
import { MarkDefSchema } from './MarkDefSchema';

export const OrthographePlusRichTextBlockSchema = z.object({
  _type: z.literal('block'),
  _key: z.string().optional(),
  style: z.enum(['normal', 'h1', 'h2', 'blockquote']).optional(),
  listItem: z.enum(['bullet', 'number']).optional(),
  level: z.number().optional(),
  children: z.array(BlockChildSchema),
  markDefs: z.array(MarkDefSchema).optional(),
});
