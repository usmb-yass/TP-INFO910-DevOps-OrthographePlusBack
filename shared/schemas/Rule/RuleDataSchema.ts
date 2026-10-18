import { z } from 'zod';
import { OrthographePlusRichTextSchema } from '../OrthographePlusRichText/OrthographePlusRichTextSchema';

export const RuleDataSchema = z.object({
    explanation: OrthographePlusRichTextSchema,
    summary: OrthographePlusRichTextSchema,
    example: OrthographePlusRichTextSchema,
    tip: OrthographePlusRichTextSchema,
});
