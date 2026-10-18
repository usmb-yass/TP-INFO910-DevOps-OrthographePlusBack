import LearningSession from '../types/LearningSession/LearningSession';
import Question from '../types/Question/Question';
import LearningSessionQuestion from '../types/LearningSession/LearningSessionQuestion';

export interface PopulatedLearningSessionQuestion<TId = string> extends Omit<LearningSessionQuestion<TId>, 'questionId'> {
    question: Question<TId>;
    rule?: {
        name: string;
    };
}

export interface PopulatedLearningSession<TId = string> extends Omit<LearningSession<TId>, 'questions'> {
    questions: PopulatedLearningSessionQuestion<TId>[];
}

export interface SubmitAnswerResponseDto<TId = string> {
    session: LearningSession<TId>;
    isCorrect: boolean;
    correctAnswer: string;
    ruleExplanation?: any[];
    newQuestions?: PopulatedLearningSessionQuestion<TId>[];
}
