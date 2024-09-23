import { TheGame, TheGmaeOptions } from '@internal/the-game';
import { resolve } from 'path';

const minPlayers = Number(process.env.GAME_MIN_PLAYERS || TheGame.DEFAULT_MIN_PLAYERS);
const tickIntervalMS = Number(
    process.env.GAME_TICK_INTERVAL_MS || TheGame.DEFAULT_TICK_INTERNVAL_MS
);
const votingTimeMS = Number(process.env.GAME_VOTING_TIME_MS || TheGame.DEFAULT_VOTNG_TIME_MS);

export const CONFIG: {
    port: number;
    basePath: string;
    game: TheGmaeOptions;
    frontendUrl: string;
    assetPath: string;
} = {
    port: Number(process.env.SERVER_PORT) > 0 ? Number(process.env.SERVER_PORT) : 3000,
    basePath: process.env.SERVER_BASE_PATH || 'localhost',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    assetPath: resolve(import.meta.dirname, '..', 'assets'),
    game: {
        minPlayers,
        tickIntervalMS,
        votingTimeMS
    }
};
