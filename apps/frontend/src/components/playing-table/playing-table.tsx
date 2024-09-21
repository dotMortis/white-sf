import { EncodedCard } from '@internal/the-game/card';
import { ServerUrl } from '../../index.js';
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
        <main
            className='playing-table'
            style={{ backgroundImage: `url(${ServerUrl}/static/yugioh/table.png)` }}>
            <DealerView drawnCards={dealerCards} />
            <PlayerView drawnCards={playerCards} />
        </main>
    );
};
