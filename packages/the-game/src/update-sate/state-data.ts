import { EncodedCard } from '../card/card.js';
import { Vote } from '../vote/vote.js';

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
