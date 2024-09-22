import { Action } from '../action.js';
import { PlayerName } from '../player/play-name.js';
import { Vote } from '../vote/vote.js';

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
