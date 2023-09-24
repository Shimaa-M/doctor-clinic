import httpStatus from 'http-status';
import mongoose from 'mongoose';
import {Request, Response} from 'express'
import * as jwt from 'jsonwebtoken'
import ApiError from '../utils/apiError';
import config from '../config/config'
import { getUserByEmail, getUserById, updateUserById } from '../services/userService';
import { IUser, IUserDoc, IUserReq } from '../DTO/user.dto';
import { JwtPayload } from '../DTO/jwt-payload.dto';
import User from '../models/user.model';

export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<IUserReq> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};
export const generateJwtAccessToken=(record:IUserReq): { accessToken: string } =>{
    const payload: JwtPayload = { id: record._id };
    const accessToken = jwt.sign(payload, config.jwt.secret,{
      
      expiresIn:config.jwt.accessExpirationMinutes,
    });
    return { accessToken };
  }
export const addJwtToCookie= async (req: Request) => {
      req.headers['authorization'] = generateJwtAccessToken(req.user).accessToken;
  
  }
/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logout = async (refreshToken: string,res:Response): Promise<void> => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
};

