export default interface School<TId = string> {
    _id: TId;
    name: string;
    country: string;
    schoolAdminId?: TId;
    licences: {
        totalSlots: number;
        slotsUsed: number;
    };
}