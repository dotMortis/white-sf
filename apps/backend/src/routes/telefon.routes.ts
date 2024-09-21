import { TheGame } from '@internal/the-game';
import { Router } from 'express';
import { TelefonController } from '../controller/telefon.controller.js';

export function TELEFON_ROUTER(theGame: TheGame) {
    const TELEFON_ROUTER = Router({ mergeParams: true });
    const controller = new TelefonController(theGame);

    TELEFON_ROUTER.route('/register').get(controller.registerHandler());
    TELEFON_ROUTER.route('/start-game').get(controller.startGameHandler());
    TELEFON_ROUTER.route('/vote-pass').get(controller.votePassHandler());
    TELEFON_ROUTER.route('/vote-draw').get(controller.voteDrawHandler());
    TELEFON_ROUTER.route('/state').get(controller.stateHandler());
    return TELEFON_ROUTER;
}
