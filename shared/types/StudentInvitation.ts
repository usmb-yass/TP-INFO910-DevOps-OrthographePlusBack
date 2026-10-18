export default interface StudentInvitation<TId = string> {
  _id: TId;
  schoolId: TId;
  classId: TId;
  invitedByUserId: TId;
  email: string;
  firstName: string;
  lastName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  token: string;
  expiresAt: Date;
  acceptedByUserId?: TId;
  acceptedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
