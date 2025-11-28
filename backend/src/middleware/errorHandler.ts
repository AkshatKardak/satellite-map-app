import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err: any) => err.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }

  if (error.code === 11000) {
    return res.status(400).json({
      error: 'Duplicate field value entered'
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error'
  });
};