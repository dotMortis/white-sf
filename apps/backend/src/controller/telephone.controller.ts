import { TheGame } from '@internal/the-game';
import { TheGameCurrentState } from '@internal/the-game/current-state';
import { join } from 'path';
import puppeteer from 'puppeteer';
import { CONFIG } from '../config.js';
import { SingleRouteActionValues, SingleRouteInpu } from '../telephone/single-route-input.js';
import { InputFromStarfacePbx } from '../telephone/starface-pbx-input.js';
import { ApiParams, ApiRequestBody, ApiRequestHandler } from '../types/api-request-handler.js';
import { LOGGER } from '../utils/logger.js';

export class TelephoneController {
    private readonly _theGame: TheGame;
    private readonly _pup: Promise<puppeteer.Browser>;

    constructor(theGame: TheGame) {
        this._theGame = theGame;
        this._pup = puppeteer.launch({ headless: true });
    }

    registerHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Register');
            this._theGame.playerUp();
            res.status(200).json({ status: true });
        };
    }

    hangUpHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Hang up');
            this._theGame.playerDown();
            res.status(200).json({ status: true });
        };
    }

    startGameHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Start game');
            this._theGame.start();
            res.status(200).json({ status: true });
        };
    }

    votePassHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Vote pass');
            this._theGame.vote('PASS');
            res.status(200).json({ status: true });
        };
    }

    voteDrawHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Vote draw');
            this._theGame.vote('DRAW');
            res.status(200).json({ status: true });
        };
    }

    stateHandler(): ApiRequestHandler<
        ApiParams,
        TheGameCurrentState,
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Game state');
            const state = this._theGame.currentStaus;
            res.status(200).json(state);
        };
    }

    actionHandler(): ApiRequestHandler<
        ApiParams,
        TheGameCurrentState | { status: boolean },
        ApiRequestBody,
        SingleRouteInpu
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Any game action');
            if (!SingleRouteActionValues.includes(req.query.action)) {
                return next(
                    new Error(
                        'Query parameter action must be one of: ' +
                            SingleRouteActionValues.join(' | ')
                    )
                );
            }
            switch (req.query.action) {
                case 'DRAW': {
                    this.voteDrawHandler()(req, res, next);
                    break;
                }
                case 'PASS': {
                    this.votePassHandler()(req, res, next);
                    break;
                }
                case 'REGISTER': {
                    this.registerHandler()(req, res, next);
                    break;
                }
                case 'HANG_UP': {
                    this.hangUpHandler()(req, res, next);
                    break;
                }
                case 'STATE': {
                    this.stateHandler()(req, res, next);
                    break;
                }
                case 'START': {
                    this.startGameHandler()(req, res, next);
                    break;
                }
                default: {
                    next(new Error(`Action "${req.query.action}" is not implmented`));
                    break;
                }
            }
        };
    }
    //155 Resolution , adjust for telephone res
    imageHandler(): ApiRequestHandler<ApiParams, any, ApiRequestBody, InputFromStarfacePbx> {
        return async (req, res, next) => {
            try {
                LOGGER.debug({ query: req.query, route: req.route }, 'Game image');

                const browser = await this._pup;
                const imgPath = join(CONFIG.assetPath, 'game.png');
                const page = await browser.newPage();
                await page.setViewport({ width: 1920 / 2, height: 1080 / 2 });
                await page.goto(CONFIG.frontendUrl);
                await page.screenshot({ path: imgPath, optimizeForSpeed: true, type: 'jpeg' });
                res.status(200).sendFile(imgPath);
            } catch (error) {
                next(error);
            }
        };
    }
}
