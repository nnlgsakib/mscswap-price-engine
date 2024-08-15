import { Request, Response, NextFunction } from 'express';
import { getReserve } from '../services/priceService';
import { CustomError } from '../types/customError';

export async function getPrice(req: Request, res: Response, next: NextFunction): Promise<void> {
    const pairAddress = req.params.pairAddress;
    try {
        const price = await getReserve(pairAddress);
        res.json({ price });
    } catch (error) {
        // Check if the error is an instance of CustomError
        if (error instanceof CustomError) {
            next(error);
        } else {
            // If not, create a new CustomError with a generic message
            next(new CustomError('An unexpected error occurred', 500));
        }
    }
}
