import { z } from "zod";
import { RuleDataSchema } from "../schemas/Rule/RuleDataSchema";

export type RuleData = z.infer<typeof RuleDataSchema>;

export default interface Rule<TId = string> {
    _id: TId;
    name: string;
    data: RuleData;
    categoryId: TId;
}