import mongoose, { Model, Document } from 'mongoose';
import {Request} from 'express'
import { Roles } from '../enum/role.enum';

export interface IUser {
 // _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: string;
}
export interface IUserReq extends IUser{
  _id: mongoose.Types.ObjectId; 
  isPasswordMatch(password: string): Promise<boolean>;
}
// export interface RequestWithUser extends Request {
//   user: IUserReq;
// }
export interface IUserDoc extends IUser, Document {
  role: string;
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
}

export type UpdateUserBody = Omit<IUser,'_id'>;

export type NewRegisteredUser = Omit<IUser, 'role'| '_id' >;

export type NewCreatedUser = Omit<IUser, 'isEmailVerified'|'_id'>;

// export interface IUserWithTokens {
//   user: IUserDoc;
//   tokens: AccessAndRefreshTokens;
// }
