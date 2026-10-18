export default interface SchoolInvitation<TId = string> {
    _id: TId;
    schoolId: TId;
    invitedByUserId: TId;
    email: string;
    role: string;
    status: string;
    token: string;
    createdAt: Date;
    expiresAt: Date;
    acceptedAt?: Date;
    userId?: TId;
}
