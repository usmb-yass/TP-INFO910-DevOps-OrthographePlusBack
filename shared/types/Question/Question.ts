import type { QuestionData } from "./QuestionData";
import QuestionType from "../../enums/QuestionType";

export default interface Question<TId = string> {
    _id: TId;
    ruleId: TId | null;
    type: QuestionType;
    isDisabled?: boolean;
    data: QuestionData;
}