import { TheGame } from '@internal/the-game';
import { Router } from 'express';
import { TelefonController } from '../controller/telefon.controller.js';

export function TELEFON_ROUTER(theGame: TheGame) {
    const TELEFON_ROUTER = Router({ mergeParams: true });
    const controller = new TelefonController(theGame);

    TELEFON_ROUTER.route('/register').get(controller.registerHandler());
    TELEFON_ROUTER.route('/start-game').get(controller.startGameHandler());
    return TELEFON_ROUTER;
}
