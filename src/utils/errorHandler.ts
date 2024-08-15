import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types/customError';
import logger from './logger';

export function errorHandler(err: CustomError, req: Request, res: Response, next: NextFunction): void {
    logger.error(`${err.statusCode || 500} - ${err.message}`);
    res.status(err.statusCode || 500).json({ error: err.message });
}
