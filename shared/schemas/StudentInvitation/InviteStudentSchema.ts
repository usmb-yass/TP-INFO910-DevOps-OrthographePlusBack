import { z } from 'zod';

export const inviteStudentSchema = z.object({
  email: z.string({ message: 'L\'email est requis' }).email({ message: 'L\'email est invalide' }),
  firstName: z.string({ message: 'Le prénom est requis' }).min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string({ message: 'Le nom de famille est requis' }).min(2, { message: 'Le nom de famille doit contenir au moins 2 caractères' }),
  classId: z.string({ message: 'L\'ID de la classe est requis' }).length(24, { message: 'L\'ID de la classe est invalide' })
});
