import { BaseLogger } from '@bits_devel/logger';
import EventEmitter from 'events';
import { Vote } from './vote.js';

export type VoteState = {
    status: 'DONE' | 'RUNNING';
    vote: Vote;
    until: Date | null;
};

export class VoteMaschine {
    private readonly _logger: BaseLogger;
    private _voteDuration: number;
    private _voteRunning: NodeJS.Timeout | null;
    private _currentVote: Vote;
    private _eventEmitter: EventEmitter;
    private _runningSince: Date | null;

    constructor(voteDuration: number, logger: BaseLogger) {
        this._logger = logger;
        this._voteDuration = voteDuration;
        this._voteRunning = null;
        this._currentVote = { draw: 0, pass: 0 };
        this._eventEmitter = new EventEmitter();
        this._runningSince = null;
    }

    get state(): VoteState {
        return {
            status: this._voteRunning === null ? 'DONE' : 'RUNNING',
            vote: { ...this._currentVote },
            until:
                this._runningSince === null
                    ? null
                    : new Date(this._runningSince.getTime() + this._voteDuration)
        };
    }

    updateVoteDuration(newDuration: number): void {
        this._logger.debug(
            { new: newDuration, old: this._voteDuration },
            'VoteMaschine: Updateing vote duration'
        );
        this._voteDuration = newDuration;
    }

    startVote(): void {
        this._logger.debug(
            { isAlreadyVoting: this._voteRunning === null },
            'VoteMaschine: Starting vote'
        );
        if (this._voteRunning !== null) {
            return;
        }
        this._currentVote = {
            draw: 0,
            pass: 0
        };
        const timeout = setTimeout(() => {
            this._updateRunning(null);
        }, this._voteDuration);
        this._updateRunning(timeout);
    }

    stopVote(): void {
        this._logger.debug(
            { voteIsRunning: this._voteRunning === null },
            'VoteMaschine: Sopping vote'
        );
        if (this._voteRunning === null) {
            return;
        }
        this._updateRunning(null);
    }

    voteDraw(): void {
        this._logger.debug(
            {
                voteIsRunning: this._voteRunning === null,
                currentVote: this._currentVote,
                newVote: this._currentVote.draw + 1
            },
            'VoteMaschine: Vote for draw'
        );
        if (this._voteRunning === null) {
            return;
        }
        ++this._currentVote.draw;
        this._emitUpdate(this.state);
    }

    votePass(): void {
        this._logger.debug(
            {
                voteIsRunning: this._voteRunning === null,
                currentVote: this._currentVote,
                newVote: this._currentVote.pass + 1
            },
            'VoteMaschine: Vote for pass'
        );
        if (this._voteRunning === null) {
            return;
        }
        ++this._currentVote.pass;
        this._emitUpdate(this.state);
    }

    onUpdate(listener: (voteState: VoteState) => void): void {
        this._logger.debug('VoteMaschine: Add onUpdate listener');
        this._eventEmitter.on('update', listener);
    }

    removeOnUpdate(listener: (voteState: VoteState) => void): void {
        this._logger.debug('VoteMaschine: Remove onUpdate listener');
        this._eventEmitter.removeListener('update', listener);
    }

    private _emitUpdate(voteState: VoteState): void {
        this._eventEmitter.emit('update', voteState);
    }

    private _updateRunning(value: null | NodeJS.Timeout): void {
        this._logger.debug(
            {
                newValueIsNull: value === null,
                oldValueIsNull: this._voteRunning === null,
                runningSince: this._runningSince
            },
            'VoteMaschine: Update running state'
        );
        if (this._voteRunning !== null && value === null) {
            clearTimeout(this._voteRunning);
        }
        if (this._voteRunning !== value) {
            this._voteRunning = value;
            this._runningSince = value !== null ? new Date() : null;
            this._emitUpdate(this.state);
        }
    }
}
