export type SessionQuestionAnswer = QuestionAnswer & {isTraining: boolean};

export default interface QuestionAnswer {
    question: string;
    answer: string | null;
    correct: boolean;
};