export default interface ActivityLog<TId = string> {
    _id: TId;
    userId: TId;
    schoolId?: TId;
    type: string;
    timestamp: Date;
    details: string;
}
