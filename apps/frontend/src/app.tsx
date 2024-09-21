import './app.css';
import { PlayingTable } from './components/playing-table/playing-table.js';
import { ScoreDisplay } from './components/score-display/score-display.js';
import { VoteChart } from './components/vote-chart/vote-chart.js';

export const App = () => {
    return (
        <main className='app'>
            <PlayingTable />
            <ScoreDisplay />
            <VoteChart votes={[4, 6]} categories={['Draw', 'Pass']} />
        </main>
    );
};
