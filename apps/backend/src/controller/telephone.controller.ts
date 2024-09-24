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
    private _page: puppeteer.Page | null;
    private _pup: puppeteer.Browser | null;

    constructor(theGame: TheGame) {
        this._theGame = theGame;
        this._page = null;
        this._pup = null;
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

    stopHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return async (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Stop');
            await this._theGame.stop();
            res.status(200).json({ status: true });
        };
    }

    startGameHandler(): ApiRequestHandler<
        ApiParams,
        { status: boolean },
        ApiRequestBody,
        InputFromStarfacePbx
    > {
        return async (req, res, next) => {
            try {
                LOGGER.debug({ query: req.query, route: req.route }, 'Start game');
                if (!this._theGame.running) {
                    this._pup ??= await puppeteer.launch({
                        headless: true,
                        args: ['--no-sandbox']
                    });
                    this._page ??= await this._pup.newPage();
                    await this._page.setViewport({ width: 1920 / 2, height: 1080 / 2 });
                    await this._page.goto(CONFIG.frontendUrl);
                }
                this._theGame.start();
                res.status(200).json({ status: true });
            } catch (error) {
                next(error);
            }
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

    stateFromHandler(): ApiRequestHandler<
        ApiParams,
        Array<TheGameCurrentState>,
        ApiRequestBody,
        InputFromStarfacePbx & { state_id: string }
    > {
        return (req, res, next) => {
            LOGGER.debug({ query: req.query, route: req.route }, 'Game state');
            if (!req.query.state_id) {
                return next(new Error('Query parameter state_id is missing'));
            }
            const state = this._theGame.currentStatesFrom(req.query.state_id);
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
                const imgPath = join(CONFIG.assetPath, 'game.png');
                await this._page?.screenshot({
                    path: imgPath,
                    optimizeForSpeed: true,
                    type: 'jpeg'
                });
                res.status(200).sendFile(imgPath);
            } catch (error) {
                next(error);
            }
        };
    }
}
