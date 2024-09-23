import { BaseLogger } from '@bits_devel/logger';
import { randomInt } from 'crypto';
import EventEmitter from 'events';
import { nextTick } from 'process';
import { Action } from './action.js';
import { CardDeck } from './card-deck.js';
import { TheGameCurrentState } from './current-state/index.js';
import { BANK_MAX_POINTS, MAX_POINTS } from './global-values.js';
import { PlayerName } from './player/play-name.js';
import { Player } from './player/player.js';
import { TheGameUpdateState } from './update-sate/index.js';
import { TheGameData } from './update-sate/state-data.js';
import { VoteMaschine, VoteState } from './vote/vote-maschine.js';
import { Vote } from './vote/vote.js';

export type TheGmaeOptions = {
    votingTimeMS: number;
    tickIntervalMS: number;
    minPlayers: number;
};

export class TheGame {
    static readonly DEFAULT_VOTNG_TIME_MS = 10_000;
    static readonly DEFAULT_TICK_INTERNVAL_MS = 2_500;
    static readonly DEFAULT_MIN_PLAYERS = 3;

    private readonly _logger: BaseLogger;
    private readonly _cardDeck: CardDeck;
    private readonly _voteStack: Array<Vote>;
    private readonly _voteMaschine: VoteMaschine;
    private readonly _eventEmitter: EventEmitter;
    private readonly _looser: Player<Extract<PlayerName, 'LOOSER'>>;
    private readonly _bank: Player<Extract<PlayerName, 'BANK'>>;
    private readonly _options: Readonly<TheGmaeOptions>;
    private _running: boolean;
    private _activePlayers: number;
    private _currentStatus: TheGameCurrentState;

    constructor(cardDeck: CardDeck, logger: BaseLogger, options?: Partial<TheGmaeOptions>) {
        this._logger = logger;
        this._options = {
            minPlayers: TheGame.DEFAULT_MIN_PLAYERS,
            tickIntervalMS: TheGame.DEFAULT_TICK_INTERNVAL_MS,
            votingTimeMS: TheGame.DEFAULT_VOTNG_TIME_MS,
            ...options
        };
        logger.debug({ options: this._options }, 'TheGame: creating');
        this._cardDeck = cardDeck;
        this._activePlayers = 0;
        this._voteStack = [];
        logger.debug('TheGame: Creating Player "BANK"');
        this._bank = new Player('BANK');
        logger.debug('TheGame: Creating Player "LOOSER"');
        this._looser = new Player('LOOSER');
        this._running = false;
        this._eventEmitter = new EventEmitter();
        this._voteMaschine = new VoteMaschine(this._options.votingTimeMS, logger);
        this._voteMaschine.onUpdate(data => this._onUpdateVote(data));
        this._currentStatus = {
            bankStatus: 'DRAW',
            humanStatus: 'DRAW',
            gameStatus: 'WAITING_FOR_PLAYERS',
            data: this.data
        };
    }

    get currentStaus(): TheGameCurrentState {
        return this._currentStatus;
    }

    get data(): TheGameData {
        return {
            bank: {
                cards: this._bank.encodedCards,
                points: this._bank.points
            },
            human: {
                activeCount: this._activePlayers,
                cards: this._looser.encodedCards,
                points: this._looser.points
            },
            votings: {
                current: this._voteMaschine.state.vote,
                past: this._voteStack
            },
            ts: new Date().toISOString()
        };
    }

    playerUp(): number {
        this._logger.debug('TheGame: Player up');
        return ++this._activePlayers;
    }

    playerDown(): number {
        this._logger.debug('TheGame: Player down');
        return this._activePlayers > 0 ? --this._activePlayers : 0;
    }

    playerReset(): number {
        this._logger.debug('TheGame: Reset players');
        return (this._activePlayers = 0);
    }

    vote(voteFor: 'DRAW' | 'PASS'): void {
        switch (voteFor) {
            case 'DRAW': {
                this._voteMaschine.voteDraw();
                break;
            }
            case 'PASS': {
                this._voteMaschine.votePass();
                break;
            }
        }
    }

    start(): void {
        this._logger.debug({ alreadyRunning: this._running }, 'TheGame: Start new game');
        if (this._running) return;
        this._running = true;
        this._cardDeck.reset();
        this._looser.resetHand();
        this._bank.resetHand();
        this._looser.addCard(this._cardDeck.draw());
        this._bank.addCard(this._cardDeck.draw());
        this._voteStack.length = 0;
        const interval = setInterval(() => {
            this._emitUpdate({
                action: 'WAITING',
                data: {
                    current: this._activePlayers,
                    min: this._options.minPlayers
                },
                ts: new Date().toISOString()
            });
            const started = this._start();
            this._logger.debug({ started }, 'TheGame: Try starting game');
            if (started) {
                clearInterval(interval);
            }
        }, 1000);
    }

    private _start(): boolean {
        if (this._activePlayers < this._options.minPlayers) {
            return false;
        }
        nextTick(() => {
            this._tick('DRAW', this._looser, 1);
        });
        return true;
    }

    onUpdate(listener: (data: TheGameUpdateState) => void): void {
        this._logger.debug('TheGame: Add on update listener');
        this._eventEmitter.on('update', listener);
    }

    removeOnUpdate(listener: (data: TheGameUpdateState) => void): void {
        this._logger.debug('TheGame: Remove on update listener');
        this._eventEmitter.removeListener('update', listener);
    }

    private _emitUpdate(data: TheGameUpdateState): void {
        this._logger.debug({ data }, 'TheGame: Emit update');
        if (data.action === 'RESULT') {
            this._running = false;
            this.playerReset();
        }
        this._setCurrentStatus(data);
        this._eventEmitter.emit('update', data);
    }

    private _setCurrentStatus(data: TheGameUpdateState): void {
        this._logger.debug({ data }, 'TheGame: Set current status');
        if (data.action === 'WAITING') {
            this._currentStatus = {
                data: data.data,
                humanStatus: 'DRAW',
                bankStatus: 'DRAW',
                gameStatus: 'WAITING_FOR_PLAYERS'
            };
        } else if (data.action === 'RESULT') {
            this._currentStatus = {
                data: data.data,
                gameStatus: 'ENDING',
                ...this._getWinnerInfo(data.data)
            };
        } else if (data.action === 'COIN') {
            this._currentStatus = {
                data: data.data,
                gameStatus: 'RUNNING',
                bankStatus: 'DRAW',
                humanStatus: 'COIN'
            };
        } else if (data.action === 'DRAW') {
            this._currentStatus = {
                data: data.data,
                bankStatus: 'DRAW',
                humanStatus: data.player === 'LOOSER' ? 'DRAW' : 'PASS',
                gameStatus: 'RUNNING'
            };
        } else if (data.action === 'PASS') {
            this._currentStatus = {
                data: data.data,
                bankStatus: data.player === 'BANK' ? 'PASS' : 'DRAW',
                humanStatus: 'PASS',
                gameStatus: 'RUNNING'
            };
        } else if (data.action === 'VOTING') {
            this._currentStatus = {
                data: data.data,
                bankStatus: 'DRAW',
                humanStatus: 'VOTING',
                gameStatus: 'RUNNING'
            };
        }
    }

    private _getWinnerInfo(data: TheGameData): Omit<TheGameCurrentState, 'data' | 'gameStatus'> {
        const bankPoints = data.bank.points;
        const humanPoints = data.human.points;
        const bankLost = bankPoints > MAX_POINTS;
        const humanLost = humanPoints > MAX_POINTS;
        this._logger.debug(
            { data, bankPoints, humanPoints, bankLost, humanLost },
            'TheGame: Calculation winner info'
        );
        return {
            bankStatus: bankLost
                ? 'LOST'
                : bankPoints < humanPoints && !humanLost
                  ? 'LOST'
                  : bankPoints === humanPoints
                    ? 'EVEN'
                    : 'WON',
            humanStatus: humanLost
                ? 'LOST'
                : humanPoints < bankPoints && !bankLost
                  ? 'LOST'
                  : bankPoints === humanPoints
                    ? 'EVEN'
                    : 'WON'
        };
    }

    private _onUpdateVote(vote: VoteState): void {
        this._logger.debug({ vote }, 'TheGame: On update vote');
        if (vote.status === 'DONE') {
            this._voteStack.unshift(vote.vote);
            if (vote.vote.draw > vote.vote.pass) {
                this._playerDraw(this._looser);
            } else if (vote.vote.pass > vote.vote.draw) {
                this._playerPass(this._looser);
            } else {
                this._tick('COIN', this._looser);
            }
        } else {
            this._emitUpdate({
                action: 'VOTING',
                player: 'LOOSER',
                data: {
                    votings: {
                        current: vote.vote,
                        past: this._voteStack,
                        until: vote.until?.toISOString() ?? null
                    }
                },
                ts: new Date().toISOString()
            });
        }
    }

    private _playerDraw(player: Player<PlayerName>): void {
        this._logger.debug({ name: Player.name }, 'TheGame: Player draws');
        player.addCard(this._cardDeck.draw());
        this._tick('DRAW', player);
    }

    private _playerPass(player: Player<PlayerName>): void {
        this._logger.debug({ name: Player.name }, 'TheGame: Player pass');
        this._tick('PASS', player);
    }

    private _tick(
        from: Extract<Action, 'DRAW' | 'PASS' | 'COIN' | 'RESULT' | 'VOTING'>,
        player: Player<PlayerName>,
        overrideNextTickInterval?: number
    ) {
        this._logger.debug(
            { from, playerName: player.name, overrideNextTickInterval },
            'TheGame: Tick'
        );
        const tickInterval = overrideNextTickInterval ?? this._options.tickIntervalMS;
        if (from === 'DRAW') {
            setTimeout(() => {
                this._emitUpdate({
                    action: 'DRAW',
                    player: player.name,
                    data: this.data,
                    ts: new Date().toISOString()
                });
                this._runNextStep('DRAW', player);
            }, tickInterval);
        } else if (from === 'PASS') {
            setTimeout(() => {
                this._emitUpdate({
                    action: 'PASS',
                    player: player.name,
                    data: this.data,
                    ts: new Date().toISOString()
                });
                this._runNextStep('PASS', player);
            }, tickInterval);
        } else if (from === 'COIN') {
            setTimeout(() => {
                const decision = this._getDecision();
                this._emitUpdate({
                    action: 'COIN',
                    player: 'LOOSER',
                    data: {
                        decision: 'PENDING'
                    },
                    ts: new Date().toISOString()
                });
                setTimeout(() => {
                    this._emitUpdate({
                        action: 'COIN',
                        player: 'LOOSER',
                        data: {
                            decision
                        },
                        ts: new Date().toISOString()
                    });
                    if (decision === 'DRAW') {
                        this._playerDraw(player);
                    } else {
                        this._playerPass(player);
                    }
                }, tickInterval);
            }, tickInterval);
        } else if (from === 'RESULT') {
            setTimeout(() => {
                this._emitUpdate({
                    action: 'RESULT',
                    data: this.data,
                    ts: new Date().toISOString()
                });
            }, tickInterval);
        } else if (from === 'VOTING') {
            setTimeout(() => {
                this._voteMaschine.startVote();
            }, tickInterval);
        }
    }

    private _runNextStep(from: Extract<Action, 'DRAW' | 'PASS'>, player: Player<PlayerName>): void {
        this._logger.debug({ from, playerName: player.name }, 'TheGame: Run next step');
        if (from === 'PASS' && player.name === 'LOOSER') {
            this._finalizeBank();
        } else if (from === 'PASS' && player.name === 'BANK') {
            this._finalizeGame();
        } else if (from === 'DRAW' && player.name === 'LOOSER') {
            if (player.points > MAX_POINTS) {
                this._looserLost();
            } else if (player.points === MAX_POINTS) {
                this._finalizeBank();
            } else {
                this._startVote();
            }
        } else if (from == 'DRAW' && player.name === 'BANK') {
            if (player.points > MAX_POINTS) {
                this._bankLost();
            } else if (player.points === MAX_POINTS) {
                this._finalizeGame();
            } else {
                this._nextBankTurn();
            }
        }
    }

    private _nextBankTurn(): void {
        this._logger.debug('TheGame: Decide next bank turn');
        if (this._bank.points < BANK_MAX_POINTS) {
            this._playerDraw(this._bank);
        } else {
            this._playerPass(this._bank);
        }
    }

    private _finalizeBank(): void {
        this._logger.debug('TheGame: Finalize Bank');
        this._nextBankTurn();
    }

    private _finalizeGame(): void {
        this._logger.debug('TheGame: Finalize game');
        this._tick('RESULT', this._bank);
    }

    private _looserLost(): void {
        this._logger.debug('TheGame: Human lost');
        this._tick('RESULT', this._looser);
    }

    private _bankLost(): void {
        this._logger.debug('TheGame: Bank lost');
        this._tick('RESULT', this._bank);
    }

    private _startVote(): void {
        this._logger.debug('TheGame: Start vote');
        this._tick('VOTING', this._looser);
    }

    private _getDecision(): 'DRAW' | 'PASS' {
        this._logger.debug('TheGame: Get coin decision');
        return randomInt(2) === 0 ? 'PASS' : 'DRAW';
    }
}
