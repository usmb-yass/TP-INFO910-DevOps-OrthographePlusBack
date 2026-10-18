import { Schema, model, Types } from 'mongoose';
import LessonType from '#shared/enums/LessonType';
import Lesson from '#shared/types/Lesson';

const LessonSchema = new Schema<Lesson<Types.ObjectId>>({
  name: { type: String, required: true },
  type: { type: String, enum: Object.values(LessonType), required: true },
  rules: [{
    ruleId: { type: Schema.Types.ObjectId, ref: 'rules', required: true },
    order: { type: Number, required: true }
  }],
  minScore: { type: Number, default: 70 },
}, { timestamps: true });

const LessonsModel = model<Lesson<Types.ObjectId>>('lessons', LessonSchema);
export default LessonsModel;
