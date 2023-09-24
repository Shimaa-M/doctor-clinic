import mongoose, { Model, Document } from 'mongoose';

export interface IPatientState {
    patientId: mongoose.Types.ObjectId;
    doctorId?: mongoose.Types.ObjectId;
  notes?: string;
  message?: string;
  treatmentSession?: string;
}

// export interface IUserDoc extends IUser, Document {
//   isPasswordMatch(password: string): Promise<boolean>;
// }

// export interface IUserModel extends Model<IUserDoc> {
//   isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
// }

export type UpdatePatientState = Omit<IPatientState,'doctorId'|'patientId'>;


