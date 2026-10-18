import { z } from 'zod';
import { createSchoolSchema } from './CreateSchoolSchema';

export const updateSchoolSchema = createSchoolSchema.partial();
