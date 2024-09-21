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
        <div className='coin-flip'>
            <div className='bar'>
                <DecisionText decision={decision} />
            </div>
            <div className='center'>
                <div
                    className='yugi'
                    style={{
                        backgroundImage: `url(${ServerUrl}/static/${DecisionImage[decision]})`
                    }}></div>
            </div>
        </div>
    );
};

const DecisionText = (properties: CoinFlipProperties) => {
    const { decision } = properties;
    switch (decision) {
        case 'DRAW':
            return <h1>Das Herz der Karten sagt ziehen!</h1>;
        case 'PASS':
            return <h1>Das Herz der Karten sagt passen!</h1>;
        case 'PENDING':
            return (
                <div>
                    <h1>Ihr seid euch unsicher.</h1>
                    <h1>Ich frage das Herz der Karten...</h1>
                </div>
            );
    }
};
