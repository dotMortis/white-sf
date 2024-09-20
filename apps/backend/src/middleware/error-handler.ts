import { ErrorRequestHandler } from 'express';
import { LOGGER } from '../utils/logger.js';

export const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    LOGGER.error(err);
    res.status(500).json({ message: err?.message ?? 'Unknown error' });
};
