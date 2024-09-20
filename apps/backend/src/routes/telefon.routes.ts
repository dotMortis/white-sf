import { Router } from 'express';
import { TEELFON_CONTROLLER } from '../controller/telefon.controller.js';

export const TELEFON_ROUTER = Router({ mergeParams: true });

TELEFON_ROUTER.route('/register').get(TEELFON_CONTROLLER.registerHandler());
