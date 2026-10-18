export default interface GradeLevel<TId = string> {
    _id: TId;
    level: number;
    grades: {
        countryId: string;
        name: string;
    }[];
}
