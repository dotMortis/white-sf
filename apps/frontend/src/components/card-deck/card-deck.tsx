import { CardSuite } from '@internal/the-game/card-suite';
import { PlayingCard } from '../playing-card/playing-card.js';
import './card-deck.css';

export const CardDeck = () => {
    return (
        <PlayingCard
            className='card-deck'
            card={{ id: 'CARD_BACK', name: 'BACK', suite: CardSuite.CLUBS }}
        />
    );
};
