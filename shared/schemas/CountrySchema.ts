import { z } from 'zod';

export const countrySchema = z.object({
    _id: z.string().min(2, { message: "Le code pays est requis (ex: FR)" }),
    name: z.string().min(1, { message: "Le nom du pays est requis" }),
});
