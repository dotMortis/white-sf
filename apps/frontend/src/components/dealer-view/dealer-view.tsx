import { CardDeck } from '../card-deck/card-deck.js';
import { PlayingCard } from '../playing-card/playing-card.js';
import './dealer-view.css';

export type DealerViewProperties = {
    drawnCards: ReadonlyArray<unknown>;
};

export const DealerView = (properties: DealerViewProperties) => {
    const { drawnCards } = properties;
    return (
        <section className='dealer-view'>
            <div className='drawn-cards'>
                {drawnCards.map((card, i) => (
                    <PlayingCard key={i} />
                ))}
            </div>
            <CardDeck />
        </section>
    );
};
