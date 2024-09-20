import { RequestHandler } from 'express';

class TelefonController {
    registerHandler(): RequestHandler {
        return (req, res, next) => {
            res.status(200).json({ status: 'JEA' });
        };
    }
}

export const TEELFON_CONTROLLER = new TelefonController();
