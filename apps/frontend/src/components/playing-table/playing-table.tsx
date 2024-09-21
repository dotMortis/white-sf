import { DealerView } from '../dealer-view/dealer-view.js';
import { PlayerView } from '../player-view/player-view.js';
import './playing-table.css';

export const PlayingTable = () => {
    return (
        <main className='playing-table'>
            <DealerView drawnCards={['', '', '']} />
            <PlayerView drawnCards={['', '']} />
        </main>
    );
};
