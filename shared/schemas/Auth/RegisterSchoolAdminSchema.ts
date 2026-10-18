import { z } from 'zod';

export const registerSchoolAdminSchema = z.object({
  token: z.string({ message: 'Le token d\'invitation est requis' }),
  firstName: z.string({ message: 'Le prénom est requis' }).min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string({ message: 'Le nom de famille est requis' }).min(2, { message: 'Le nom de famille doit contenir au moins 2 caractères' }),
  password: z.string({ message: 'Le mot de passe est requis' }).min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' }),
});
