import { EncodedCard } from '@internal/the-game/card';
import { DealerView } from '../dealer-view/dealer-view.js';
import { PlayerView } from '../player-view/player-view.js';
import './playing-table.css';

export type PlayingTableProperties = {
    dealerCards: ReadonlyArray<EncodedCard>;
    playerCards: ReadonlyArray<EncodedCard>;
};

export const PlayingTable = (properties: PlayingTableProperties) => {
    const { dealerCards, playerCards } = properties;
    return (
        <main className='playing-table'>
            <DealerView drawnCards={dealerCards} />
            <PlayerView drawnCards={playerCards} />
        </main>
    );
};
