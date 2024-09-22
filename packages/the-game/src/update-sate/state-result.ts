import { Action } from '../action.js';
import { TheGameData } from './state-data.js';

export type TheGameStateResult = {
    action: Extract<Action, 'RESULT'>;
    data: TheGameData;
    ts: string;
};
