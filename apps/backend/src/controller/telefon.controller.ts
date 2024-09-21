import { TheGame } from '@internal/the-game';
import { RequestHandler } from 'express';

export class TelefonController {
    private readonly _theGame: TheGame;

    constructor(theGame: TheGame) {
        this._theGame = theGame;
    }

    registerHandler(): RequestHandler {
        return (req, res, next) => {
            res.status(200).json({ status: 'JEA' });
        };
    }

    startGameHandler(): RequestHandler {
        return (req, res, next) => {
            this._theGame.start();
            res.status(200).json({ status: 'JEA' });
        };
    }
}
