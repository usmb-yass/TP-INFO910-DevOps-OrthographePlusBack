import User from '../types/User';
import Country from '../types/Country';
import GradeLevel from '../types/GradeLevel';

export interface PopulatedGradeLevel<TId = string> extends Omit<GradeLevel<TId>, 'grades'> {
    grade: GradeLevel<TId>['grades'][0];
}

export interface PopulatedUser<TId = string> extends Omit<User<TId>, 'countryId' | 'gradeLevelId' | 'passwordHash' | 'saltHash' | 'passwordMetadata'> {
    country?: Country;
    gradeLevel?: PopulatedGradeLevel<TId>;
}
