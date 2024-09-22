import { TheGameStateCoin } from './state-coin.js';
import { TheGameStateDefault } from './state-default.js';
import { TheGameStateResult } from './state-result.js';
import { TheGameStateVoting } from './state-voting.js';
import { TheGameStateWaiting } from './state-waiting.js';

export type TheGameUpdateState =
    | TheGameStateDefault
    | TheGameStateCoin
    | TheGameStateVoting
    | TheGameStateResult
    | TheGameStateWaiting;
