import { Action } from '../action.js';
import { CoinState } from '../coin-state.js';
import { PlayerName } from '../player/play-name.js';

export type TheGameStateCoin = {
    action: Extract<Action, 'COIN'>;
    player: Extract<PlayerName, 'LOOSER'>;
    data: {
        decision: CoinState;
    };
    ts: string;
};
