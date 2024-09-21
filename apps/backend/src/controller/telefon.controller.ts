import { TheGame } from '@internal/the-game';
import { RequestHandler } from 'express';

export class TelefonController {
    private readonly _theGame: TheGame;

    constructor(theGame: TheGame) {
        this._theGame = theGame;
    }

    registerHandler(): RequestHandler {
        return (req, res, next) => {
            this._theGame.playerUp();
            res.status(200).json({ status: 'registered' });
        };
    }

    startGameHandler(): RequestHandler {
        return (req, res, next) => {
            this._theGame.start();
            res.status(200).json({ status: 'started game' });
        };
    }

    votePassHandler(): RequestHandler {
        return (req, res, next) => {
            this._theGame.vote('PASS');
            res.status(200).json({ status: 'voted pass' });
        };
    }

    voteDrawHandler(): RequestHandler {
        return (req, res, next) => {
            this._theGame.vote('DRAW');
            res.status(200).json({ status: 'voted draw' });
        };
    }

    stateHandler(): RequestHandler {
        return (req, res, next) => {};
    }
}
