import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync';
import  * as userService  from '../services/userService';
import * as authService from '../services/authService';
import config from '../config/config';
import User from '../models/user.model'

export const signup = catchAsync(async (req: Request, res: Response) => {
   req.user = await userService.registerUser(req.body);
   await authService.addJwtToCookie(req);
    res.status(httpStatus.CREATED).send({ accessToken: req.headers['authorization'] as string, user:req.user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  req.user = await authService.loginUserWithEmailAndPassword(email, password);
    authService.addJwtToCookie(req);
   // delete req.user.password;
    res.send({ accessToken: req.headers['authorization'] as string, user:req.user});
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  await authService.logout(req.body.refreshToken,res);
  res.status(httpStatus.NO_CONTENT).send();
});
export const restrictTo = (...roles:string[]) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    const token:string = req.headers['authorization']? req.headers.authorization.split(' ')[1]:"";

    
      const decodedToken = jwt.verify(token, config.jwt.secret);
      console.log(decodedToken)
      req.user = decodedToken;
    if (!decodedToken) return res.sendStatus(401);
      const user = await User.findById(req.user.id)
    // Check the user's role.
    console.log(user)
    if (req.user.role != 'DOCTOR') {
        
        // The user is not authorized to access this route.
        return res.sendStatus(403);
      }
    // The user is logged in and authorized to access this route.
    next();
  }
};