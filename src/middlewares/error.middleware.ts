import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response';
import { config } from '../config';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Custom error formatting can be added here (e.g., for Zod, Prisma errors)
  let formattedErrors = err.errors || null;

  if (err.name === 'ZodError') {
    formattedErrors = err.errors;
  }

  sendResponse(
    res,
    statusCode,
    false,
    message,
    null,
    config.NODE_ENV === 'development' ? formattedErrors || err.stack : formattedErrors
  );
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  sendResponse(res, 404, false, `Route ${req.originalUrl} not found`);
};
