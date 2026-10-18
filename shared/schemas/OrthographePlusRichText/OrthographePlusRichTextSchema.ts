import { z } from 'zod';
import { OrthographePlusRichTextBlockSchema } from './OrthographePlusRichTextBlockSchema';

export const OrthographePlusRichTextSchema = z.array(OrthographePlusRichTextBlockSchema);
