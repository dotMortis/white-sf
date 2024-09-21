import './app.css';
import { PlayingTable } from './components/playing-table/playing-table.js';
import { ScoreDisplay } from './components/score-display/score-display.js';

export const App = () => {
    return (
        <main className='app'>
            <PlayingTable />
            <ScoreDisplay />
        </main>
    );
};
