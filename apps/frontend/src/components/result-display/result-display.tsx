import { PlayerName } from '@internal/the-game';
import './result-display.css';

export type ResultDisplayProperties = {
    winner: PlayerName | 'DRAW';
};

export const ResultDisplay = (properties: ResultDisplayProperties) => {
    const { winner } = properties;

    return <div className='result-display'>{winnerText(winner)}</div>;
};

const winnerText = (winner: ResultDisplayProperties['winner']) => {
    switch (winner) {
        case 'BANK':
            return 'Ihr habt verloren :(';
        case 'DRAW':
            return 'Unentschieden';
        case 'LOOSER':
            return 'Ihr habt gewonnen!';
    }
};
