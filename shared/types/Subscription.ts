export default interface Subscription<TId = string> {
    _id: TId;
    userId: TId;
    plan: string;
    status: string;
    startedAt: Date;
    expiresAt: Date;
    cancelAtPeriodEnd: boolean;
}
