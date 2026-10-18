import QuestionOption from "./QuestionOption";


export interface QcmData {
    sentence: string;
    options: QuestionOption[];
    correctOption: string;
}

export interface TrouData {
    sentence: string;
    answer: string[];
    audioUrl?: string;
}

export type QuestionData = QcmData | TrouData;
