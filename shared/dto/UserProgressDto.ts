import UserProgress from '../types/UserProgress';
import Lesson from '../types/Lesson';
import Rule from '../types/Rule';
import Category from '../types/Category';

export type RuleSummary<TId = string> = Omit<Rule<TId>, 'data' | 'categoryId'> & {
    categoryId: Category<TId>;
};

export interface PopulatedLesson<TId = string> extends Omit<Lesson<TId>, 'rules'> {
    rules: {
        ruleId: RuleSummary<TId>;
        order: number;
    }[];
}

export interface MyProgressResponse<TId = string> extends Omit<UserProgress<TId>, 'currentLessonId'> {
    currentLessonId?: PopulatedLesson<TId>;
}
