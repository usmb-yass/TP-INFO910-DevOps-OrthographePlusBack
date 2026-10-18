import { z } from 'zod';

export const createSchoolSchema = z.object({
    name: z.string({ message: "Le nom de l'école est requis" }),
    email: z.string({ message: "L'email est requis" }).email({ message: "Format d'email invalide" }),
    maxLicenses: z.number({ message: "Le nombre de licences est requis" }).min(1, { message: "Au moins 1 licence est requise" }),
    country: z.string({ message: "Le pays est requis" })
});
