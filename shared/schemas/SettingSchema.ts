import { z } from 'zod';
import DailyResetType from '../enums/DailyResetType';

const rolling24hSchema = z.object({
    type: z.literal(DailyResetType.ROLLING_24H)
});

const localTimeSchema = z.object({
    type: z.literal(DailyResetType.LOCAL_TIME),
    time: z.string({ message: "L'heure est invalide" }).min(1, "L'heure (time) est requise quand le type est LOCAL_TIME")
});

export const settingSchema = z.object({
    maxLessonsPerDay: z.number().int({ message: "La valeur doit être un entier" }).min(1, { message: "La valeur doit être au moins 1" }).optional(),
    numberOfQuestionsPerRule: z.number().int({ message: "La valeur doit être un entier" }).min(1, { message: "La valeur doit être au moins 1" }).optional(),
    dailyReset: z.discriminatedUnion('type', [
        rolling24hSchema,
        localTimeSchema
    ]).optional()
});
