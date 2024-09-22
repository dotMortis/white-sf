import { TheGame } from '@internal/the-game';
import { Router } from 'express';
import { TelephoneController } from '../controller/telephone.controller.js';
import { LOGGER } from '../utils/logger.js';

export function TELEPHONE_ROUTER(theGame: TheGame) {
    LOGGER.debug('Creating telephone router');
    const TELEFON_ROUTER = Router({ mergeParams: true });
    const controller = new TelephoneController(theGame);

    TELEFON_ROUTER.route('/register').get(controller.registerHandler());
    TELEFON_ROUTER.route('/hangup').get(controller.hangUpHandler());
    TELEFON_ROUTER.route('/start').get(controller.startGameHandler());
    TELEFON_ROUTER.route('/pass').get(controller.votePassHandler());
    TELEFON_ROUTER.route('/draw').get(controller.voteDrawHandler());
    TELEFON_ROUTER.route('/state').get(controller.stateHandler());
    TELEFON_ROUTER.route('/action').get(controller.actionHandler());
    return TELEFON_ROUTER;
}
