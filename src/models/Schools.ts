import { Schema, model, Types } from "mongoose";
import School from '#shared/types/School';

const SchoolSchema = new Schema<School<Types.ObjectId>>({
   name: {
    type: String,
    required: true
   },
   country: {
    type: String,
    ref: "countries",
    required: true
   },
   schoolAdminId: {
    type: Schema.Types.ObjectId,
    ref: "users"
   },
   licences: {
    totalSlots: {
        type: Number,
        default: 0
    },
    slotsUsed: {
        type: Number,
        default: 0
    }
   }
});

const SchoolsModel = model<School<Types.ObjectId>>('schools', SchoolSchema);

export default SchoolsModel;