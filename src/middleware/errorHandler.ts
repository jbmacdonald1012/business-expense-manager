import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: 'Something went wrong!' });
};