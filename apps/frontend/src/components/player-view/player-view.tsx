import { PlayingCard } from '../playing-card/playing-card.js';
import './player-view.css';

export type PlayerViewProperties = {
    drawnCards: ReadonlyArray<unknown>;
};

export const PlayerView = (properties: PlayerViewProperties) => {
    const { drawnCards } = properties;
    return (
        <section className='player-view'>
            <div className='drawn-cards'>
                {drawnCards.map((card, i) => (
                    <PlayingCard key={i} />
                ))}
            </div>
        </section>
    );
};
