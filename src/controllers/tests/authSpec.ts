
import User from '../../models/user.model';
import * as authService from '../../services/authService';
import mongoose from 'mongoose';
import { NextFunction, Request,Response, response } from 'express';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../app';
import { doesNotMatch } from 'assert';
let req:Request,res:Response,next:NextFunction
describe('POST /v1/auth/login', () => {
  beforeAll(()=> {
    const password = 'mariam12!';
    const hashedPassword = bcrypt.hashSync(password,8);
       User.create({name:'Mariam Hossam',email:'mariam@gmail.com',password:hashedPassword,role:'DOCTOR'})
  })
  it('should return 200 and login user if email and password match', async () => {
    const password = 'mariam12!';
    const hashedPassword = bcrypt.hashSync(password,8);
      const loginCredentials = {
        email: 'mariam@gmail.com',
        password: hashedPassword
    };
   request(app).post('/v1/auth/login').send(loginCredentials);
  expect(response.statusCode).toBe(200);
    });

    it('should return 401 error if there are no users with that email', async () => {
      const password = 'mariam12!';
      const hashedPassword = bcrypt.hashSync(password,8);
        const loginCredentials = {
          email: 'mariam2@gmail.com',
          password: hashedPassword
      };

      const res =  request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
    });

    it('should return 401 error if password is wrong', async () => {
      const password = 'mariam12';
      const hashedPassword = bcrypt.hashSync(password,8);
        const loginCredentials = {
          email: 'mariam@gmail.com',
          password: hashedPassword
      };

      const res = request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);
    });
  });
    