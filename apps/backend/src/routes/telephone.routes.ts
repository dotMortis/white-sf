import { TheGame } from '@internal/the-game';
import { Router } from 'express';
import { TelephoneController } from '../controller/telephone.controller.js';
import { LOGGER } from '../utils/logger.js';

export function TELEPHONE_ROUTER(theGame: TheGame) {
    LOGGER.debug('Creating telephone router');
    const TELEFON_ROUTER = Router({ mergeParams: true });
    const controller = new TelephoneController(theGame);

    LOGGER.debug('Creating router: /register');
    TELEFON_ROUTER.route('/register').get(controller.registerHandler());
    LOGGER.debug('Creating router: /hang-up');
    TELEFON_ROUTER.route('/hang-up').get(controller.hangUpHandler());
    LOGGER.debug('Creating router: /start-game');
    TELEFON_ROUTER.route('/start-game').get(controller.startGameHandler());
    LOGGER.debug('Creating router: /vote-pass');
    TELEFON_ROUTER.route('/vote-pass').get(controller.votePassHandler());
    LOGGER.debug('Creating router: /vote-draw');
    TELEFON_ROUTER.route('/vote-draw').get(controller.voteDrawHandler());
    LOGGER.debug('Creating router: /state');
    TELEFON_ROUTER.route('/state').get(controller.stateHandler());
    LOGGER.debug('Creating router: /action');
    TELEFON_ROUTER.route('/action').get(controller.actionHandler());
    return TELEFON_ROUTER;
}
