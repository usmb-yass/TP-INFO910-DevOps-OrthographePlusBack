import { Schema, model, Types } from 'mongoose';
import GradeLevel from '#shared/types/GradeLevel';

const GradeLevelSchema = new Schema<GradeLevel<Types.ObjectId>>({
  level: { type: Number, required: true, unique: true },
  grades: [{
    countryId: { type: String, ref: 'countries', required: true },
    name: { type: String, required: true }
  }]
});

const GradeLevelsModel = model<GradeLevel<Types.ObjectId>>('grade-levels', GradeLevelSchema);
export default GradeLevelsModel;
