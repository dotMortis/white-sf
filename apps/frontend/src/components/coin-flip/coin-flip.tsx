import { CoinDecision } from '@internal/the-game';
import { ServerUrl } from '../../index.js';
import './coin-flip.css';

export type CoinFlipProperties = {
    decision: CoinDecision;
};

const DecisionImage = {
    DRAW: 'yugioh/coin-draw.png',
    PASS: 'yugioh/coin-pass.png',
    PENDING: 'yugioh/coin-running.png'
} satisfies Record<CoinDecision, string>;

export const CoinFlip = (properties: CoinFlipProperties) => {
    const { decision } = properties;
    return (
        <div
            className='coin-flip'
            style={{
                backgroundImage: `url(${ServerUrl}/static/${DecisionImage[decision]})`
            }}></div>
    );
};
