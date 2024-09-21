import './app.css';
import { Overlay } from './components/overlay/overlay.js';
import { PlayingTable } from './components/playing-table/playing-table.js';
import { ScoreDisplay } from './components/score-display/score-display.js';
import { VoteChart } from './components/vote-chart/vote-chart.js';

export const App = () => {
    return (
        <main className='app'>
            <PlayingTable />
            <ScoreDisplay dealerScore={0} playerScore={0} />
            <VoteChart votes={[4, 6]} categories={['Draw', 'Pass']} />
            <Overlay open={true}>
                <p style={{ backgroundColor: 'white' }}></p>
            </Overlay>
        </main>
    );
};
