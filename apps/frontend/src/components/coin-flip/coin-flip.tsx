import { CoinState } from '@internal/the-game/coin-state';
import { ServerUrl } from '../../index.js';
import './coin-flip.css';

export type CoinFlipProperties = {
    decision: CoinState;
};

const DecisionImage = {
    DRAW: 'yugioh/coin-draw.png',
    PASS: 'yugioh/coin-pass.png',
    PENDING: 'yugioh/coin-running.png'
} satisfies Record<CoinState, string>;

export const CoinFlip = (properties: CoinFlipProperties) => {
    const { decision } = properties;
    return (
        <div className='coin-flip'>
            <div className='bar'></div>
            <div className='center'>
                <div
                    className='yugi'
                    style={{
                        backgroundImage: `url(${ServerUrl}/static/${DecisionImage[decision]})`
                    }}></div>
                <DecisionText decision={decision} />
            </div>
        </div>
    );
};

const DecisionText = (properties: CoinFlipProperties) => {
    const { decision } = properties;
    switch (decision) {
        case 'DRAW':
            return <h1 class='coin-text'>Das Herz der Karten sagt ziehen!</h1>;
        case 'PASS':
            return <h1 class='coin-text'>Das Herz der Karten sagt passen!</h1>;
        case 'PENDING':
            return (
                <div class='coin-text'>
                    <h1>Ihr seid euch unsicher.</h1>
                    <h1>Ich frage das Herz der Karten...</h1>
                </div>
            );
    }
};
