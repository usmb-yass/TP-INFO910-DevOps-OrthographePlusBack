import { z } from 'zod';

export const categorySchema = z.object({
    name: z.string().min(1, "Le nom de la catégorie est requis"),
});
