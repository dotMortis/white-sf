import { randomInt } from 'crypto';
import EventEmitter from 'events';
import { CardDeck } from './card-deck.js';
import { EncodedCard } from './card.js';
import { BANK_MAX_POINTS, MAX_POINTS } from './global-values.js';
import { Player } from './player.js';
import { VoteMaschine, VoteState } from './vote/vote-maschine.js';
import { Vote } from './vote/vote.js';

export type PlayerName = 'BANK' | 'LOOSER';

export type Action = 'DRAW' | 'PASS' | 'RESULT' | 'VOTING' | 'CANCEL' | 'COIN';

export type CoinDecision = 'DRAW' | 'PASS' | 'PENDING';

export type TheGameStateCoin = {
    action: Extract<Action, 'COIN'>;
    player: Extract<PlayerName, 'LOOSER'>;
    data: {
        decision: CoinDecision;
    };
    ts: string;
};

export type TheGameData = {
    bank: {
        cards: ReadonlyArray<EncodedCard>;
        points: number;
    };
    human: {
        activeCount: number;
        cards: ReadonlyArray<EncodedCard>;
        points: number;
    };
    votings: {
        current: Vote;
        past: ReadonlyArray<Vote>;
    };
    ts: string;
};

export type TheGameStateVoting = {
    action: Extract<Action, 'VOTING'>;
    player: Extract<PlayerName, 'LOOSER'>;
    data: {
        votings: {
            current: Vote;
            past: ReadonlyArray<Vote>;
            until: string | null;
        };
    };
    ts: string;
};

export type TheGameStateDefault = {
    action: Extract<Action, 'PASS' | 'DRAW' | 'CANCEL'>;
    player: PlayerName;
    data: TheGameData;
    ts: string;
};

export type TheGameStateResult = {
    action: Extract<Action, 'RESULT'>;
    data: TheGameData;
    ts: string;
};

export type TheGameState =
    | TheGameStateDefault
    | TheGameStateCoin
    | TheGameStateVoting
    | TheGameStateResult;

export type TheGameStatus = 'WAITING_FOR_PLAYERS' | 'RUNNING';
export type BankStatus = 'DRAW' | 'PASS' | 'LOST' | 'WON';
export type HumanStatus = 'DRAW' | 'PASS' | 'LOST' | 'WON' | 'VOTING' | 'COIN';

export type TheGameCurrentStatus = {
    gameStatus: TheGameStatus;
    bankStatus: BankStatus;
    humanStatus: HumanStatus;
    data: TheGameData;
};

export class TheGame {
    static readonly DEFAULT_WAITING_MS = 10_000;
    static readonly TICK_INTERNVAL = 2_500;

    private readonly _cardDeck: CardDeck;
    private readonly _voteStack: Array<Vote>;
    private readonly _voteMaschine: VoteMaschine;
    private readonly _eventEmitter: EventEmitter;
    private readonly _looser: Player<Extract<PlayerName, 'LOOSER'>>;
    private readonly _bank: Player<Extract<PlayerName, 'BANK'>>;
    private _running: boolean;
    private _activePlayers: number;
    private _currentStatus: TheGameCurrentStatus;

    constructor(cardDeck: CardDeck) {
        this._cardDeck = cardDeck;
        this._activePlayers = 0;
        this._voteStack = [];
        this._bank = new Player('BANK');
        this._looser = new Player('LOOSER');
        this._running = false;
        this._eventEmitter = new EventEmitter();
        this._voteMaschine = new VoteMaschine(TheGame.DEFAULT_WAITING_MS);
        this._voteMaschine.onUpdate(data => this._onUpdateVote(data));
        this._currentStatus = {
            bankStatus: 'DRAW',
            humanStatus: 'DRAW',
            gameStatus: 'WAITING_FOR_PLAYERS',
            data: this.data
        };
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
        return ++this._activePlayers;
    }

    playerDown(): number {
        return this._activePlayers > 0 ? --this._activePlayers : 0;
    }

    playerReset(): number {
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
        if (this._running) return;
        this._running = true;
        this._cardDeck.reset();
        this._looser.resetHand();
        this._bank.resetHand();
        this._looser.addCard(this._cardDeck.draw());
        this._bank.addCard(this._cardDeck.draw());
        this._tick('DRAW', this._looser);
    }

    onUpdate(listener: (data: TheGameState) => void): void {
        this._eventEmitter.on('update', listener);
    }

    removeOnUpdate(listener: (data: TheGameState) => void): void {
        this._eventEmitter.removeListener('update', listener);
    }

    private _emitUpdate(data: TheGameState): void {
        if (data.action === 'RESULT') {
            this._running = false;
        }
        this._eventEmitter.emit('update', data);
    }

    private _onUpdateVote(vote: VoteState): void {
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
        player.addCard(this._cardDeck.draw());
        this._tick('DRAW', player);
    }

    private _playerPass(player: Player<PlayerName>): void {
        this._tick('PASS', player);
    }

    private _tick(
        from: Extract<Action, 'DRAW' | 'PASS' | 'COIN' | 'RESULT' | 'VOTING'>,
        player: Player<PlayerName>
    ) {
        if (from === 'DRAW') {
            setTimeout(() => {
                this._emitUpdate({
                    action: 'DRAW',
                    player: player.name,
                    data: this.data,
                    ts: new Date().toISOString()
                });
                this._runNextStep('DRAW', player);
            }, TheGame.TICK_INTERNVAL);
        } else if (from === 'PASS') {
            setTimeout(() => {
                this._emitUpdate({
                    action: 'PASS',
                    player: player.name,
                    data: this.data,
                    ts: new Date().toISOString()
                });
                this._runNextStep('PASS', player);
            }, TheGame.TICK_INTERNVAL);
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
                }, TheGame.TICK_INTERNVAL);
            }, TheGame.TICK_INTERNVAL);
        } else if (from === 'RESULT') {
            setTimeout(() => {
                this._emitUpdate({
                    action: 'RESULT',
                    data: this.data,
                    ts: new Date().toISOString()
                });
            }, TheGame.TICK_INTERNVAL);
        } else if (from === 'VOTING') {
            setTimeout(() => {
                this._voteMaschine.startVote();
            }, TheGame.TICK_INTERNVAL);
        }
    }

    private _runNextStep(from: Extract<Action, 'DRAW' | 'PASS'>, player: Player<PlayerName>): void {
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
        if (this._bank.points < BANK_MAX_POINTS) {
            this._playerDraw(this._bank);
        } else {
            this._playerPass(this._bank);
        }
    }

    private _finalizeBank(): void {
        this._nextBankTurn();
    }

    private _finalizeGame(): void {
        this._tick('RESULT', this._bank);
    }

    private _looserLost(): void {
        this._tick('RESULT', this._looser);
    }

    private _bankLost(): void {
        this._tick('RESULT', this._bank);
    }

    private _startVote(): void {
        this._tick('VOTING', this._looser);
    }

    private _getDecision(): 'DRAW' | 'PASS' {
        return randomInt(0, 1) === 0 ? 'PASS' : 'DRAW';
    }
}
