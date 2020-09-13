import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) { // remove '!'
    next();
  } else {
    console.log('Invalid token');
  }
};
