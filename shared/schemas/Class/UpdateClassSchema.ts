import { z } from 'zod';
import { createClassSchema } from './CreateClassSchema';

export const updateClassSchema = createClassSchema.partial();
