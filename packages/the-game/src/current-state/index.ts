import { TheGameUpdateState } from '../update-sate/index.js';
import { BankStatus } from './bank-status.js';
import { TheGameStatus } from './game-status.js';
import { HumanStatus } from './human-status.js';

export type TheGameCurrentState = {
    gameStatus: TheGameStatus;
    bankStatus: BankStatus;
    humanStatus: HumanStatus;
    data: TheGameUpdateState['data'];
};
