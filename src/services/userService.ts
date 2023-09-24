import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Request } from 'express';
import User from '../models/user.model';
import PatientState from '../models/patinet-state.model';
import ApiError from '../utils/apiError';
import { NewCreatedUser, UpdateUserBody, IUserDoc, NewRegisteredUser, IUserReq } from '../DTO/user.dto';
import * as emailService from './emailService';
import { IPatientState, UpdatePatientState } from '../DTO/state.dto';
/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewRegisteredUser): Promise<IUserReq> => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
      }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @returns {Promise<QueryResult>}
 */
// export const queryUsers = async (filter: Record<string, any>, options: IOptions): Promise<QueryResult> => {
//   const users = await User.paginate(filter, options);
//   return users;
// };
export const findAllPatients = async (req:Request) => {
    const users = await User.aggregate([{
      $match:{role:'PATIENT'}
    }, {
        $lookup: {
            from: 'patientstates',
            localField: '_id',
            foreignField: 'patientId',
            as: 'patient'
        }
        },
        {
            $unwind: {
                path: '$patient',
                preserveNullAndEmptyArrays: true
            }
        }]);
  return users;
};
export const createPatientState = async (userBody: IPatientState): Promise<any> => {
  
    return PatientState.create(userBody);
};
export const updatePatientState = async (
    patientId: mongoose.Types.ObjectId,
    updateBody: UpdatePatientState
  ): Promise<any> => {
    const patient = await getUserById(patientId);
    if (!patient) {
      throw new ApiError(httpStatus.NOT_FOUND, 'patient not found');
    }
    await PatientState.updateOne({ patientId }, { ...updateBody })
    await emailService.sendPatientNotificationsEmail(patient.email, updateBody.notes)
    const fullPatientData = User.aggregate([{
        $match:{_id:patientId}
    }, {
        $lookup: {
            from: 'patientstates',
            localField: 'patientId',
            foreignField: '_id',
            as: 'patient'
        }
        },
        {
            $unwind: {
                path: '$patient',
                preserveNullAndEmptyArrays: true
            }
    }])
    return fullPatientData;
  };
/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> => User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserReq | null> => User.findOne({ email });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: mongoose.Types.ObjectId,
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {mongoose.Types.ObjectId} userId
 * @returns {Promise<IUserDoc | null>}
 */
export const deleteUserById = async (userId: mongoose.Types.ObjectId): Promise<IUserDoc | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.deleteOne();
  return user;
};
