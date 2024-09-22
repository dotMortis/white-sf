import { Action } from '../action.js';
import { PlayerName } from '../player/play-name.js';
import { TheGameData } from './state-data.js';

export type TheGameStateDefault = {
    action: Extract<Action, 'PASS' | 'DRAW' | 'CANCEL'>;
    player: PlayerName;
    data: TheGameData;
    ts: string;
};
