import { EncodedCard } from '@internal/the-game/card';
import { PlayingCard } from '../playing-card/playing-card.js';
import './player-view.css';

export type PlayerViewProperties = {
    drawnCards: ReadonlyArray<EncodedCard>;
};

export const PlayerView = (properties: PlayerViewProperties) => {
    const { drawnCards } = properties;
    return (
        <section className='player-view'>
            <div className='drawn-cards'>
                {drawnCards.map((card, i) => (
                    <PlayingCard key={i} card={card} />
                ))}
            </div>
        </section>
    );
};
