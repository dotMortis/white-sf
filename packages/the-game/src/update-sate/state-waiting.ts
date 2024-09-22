import { Action } from '../action.js';

export type TheGameStateWaiting = {
    action: Extract<Action, 'WAITING'>;
    data: {
        min: number;
        current: number;
    };
    ts: string;
};
