import { Request,Response,NextFunction } from "express";
const jwt = require('jsonwebtoken');

export const validateLoginAndRole = async (req:Request, res:Response, next:NextFunction) => {
  // Get the user's JWT token from the request headers.
  const token = req.headers['authorization'];

  // Verify the JWT token.
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
  } catch (error) {
    // The token is invalid.
    return res.sendStatus(401);
  }

  // Check the user's role.
  if (req.user.role !== 'DOCTOR') {
    // The user is not authorized to access this route.
    return res.sendStatus(403);
  }

  // The user is logged in and authorized to access this route.
  next();
};