import { Schema } from "mongoose";
import QuestionOption from '#shared/types/Question/QuestionOption';

const QuestionOptionsSchema = new Schema<QuestionOption>({
    id: { type: String, required: true },
    text: { type: String, required: true }
}, { _id: false });

export default QuestionOptionsSchema;
