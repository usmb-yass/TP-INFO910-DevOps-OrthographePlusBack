import { z } from 'zod';
import { OrthographePlusRichTextSchema } from "../../schemas/OrthographePlusRichText/OrthographePlusRichTextSchema";
import { OrthographePlusRichTextBlockSchema } from "../../schemas/OrthographePlusRichText/OrthographePlusRichTextBlockSchema";
import { SpanSchema } from "../../schemas/OrthographePlusRichText/SpanSchema";
import { MarkDefSchema } from "../../schemas/OrthographePlusRichText/MarkDefSchema";

// 4. Inférence des types TypeScript
export type OrthographePlusRichText = z.infer<typeof OrthographePlusRichTextSchema>;
export type OrthographePlusRichTextBlock = z.infer<typeof OrthographePlusRichTextBlockSchema>;
export type Span = z.infer<typeof SpanSchema>;
export type MarkDef = z.infer<typeof MarkDefSchema>;
