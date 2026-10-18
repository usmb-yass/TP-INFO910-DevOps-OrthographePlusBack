import { Schema, model, Types } from 'mongoose';
import Program from '#shared/types/Program';

const ProgramSchema = new Schema<Program<Types.ObjectId>>({
  name: { type: String, required: true },
  gradeLevelId: { type: Schema.Types.ObjectId, ref: 'grade-levels', required: true, unique: true },
  lessons: [{
    lessonId: { type: Schema.Types.ObjectId, ref: 'lessons', required: true },
    order: { type: Number, required: true }
  }],
}, { timestamps: true });

const ProgramsModel = model<Program<Types.ObjectId>>('programs', ProgramSchema);
export default ProgramsModel;
