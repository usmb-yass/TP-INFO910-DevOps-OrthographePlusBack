export default interface Class<TId = string> {
    _id: TId;
    schoolId: TId;
    name: string;
    gradeLevelId: TId;
    createdAt?: Date;
}
