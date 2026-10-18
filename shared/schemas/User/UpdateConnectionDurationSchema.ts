import { z } from 'zod';

export const updateConnectionDurationSchema = z.object({
    duration: z.number({ message: "La durée est requise" }).int({ message: "La durée doit être un entier" }).min(0, { message: "La durée ne peut pas être négative" })
});
