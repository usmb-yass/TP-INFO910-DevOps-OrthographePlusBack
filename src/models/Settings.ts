import { Schema, model } from 'mongoose';
import DailyResetType from '#shared/enums/DailyResetType';
import Setting from '#shared/types/Setting';

const SettingsSchema = new Schema<Setting>({
  _id: { type: String, required: true }, 
  maxLessonsPerDay: { type: Number, required: true, default: 2 },
  numberOfQuestionsPerRule: { type: Number, required: true, default: 7 },
  dailyReset: {
    type: { type: String, enum: Object.values(DailyResetType), required: true },
    time: { type: String }
  }
}, { timestamps: true });

const SettingsModel = model<Setting>('settings', SettingsSchema);
export default SettingsModel;
