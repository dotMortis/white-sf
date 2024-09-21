import { useEffect, useState } from 'preact/hooks';
import './app.css';
import { BackendSocketEvents } from './backend/backend-socket.js';
import { LoadingOverlay } from './components/loading-overlay/loading-overlay.js';
import { Overlay } from './components/overlay/overlay.js';
import { PlayingTable } from './components/playing-table/playing-table.js';
import { ScoreDisplay } from './components/score-display/score-display.js';
import { VoteChart } from './components/vote-chart/vote-chart.js';
import { useBackend } from './hooks/use-backend.js';
import { EventListener } from './util/listenable.js';

const WebsocketUrl = 'ws://localhost:3000';

export const App = () => {
    const [backend, backendReady] = useBackend(WebsocketUrl);
    const [scores, setScores] = useState([0, 0]);

    useEffect(() => {
        const drawListener: EventListener<BackendSocketEvents, 'draw'> = (
            drawingActor,
            dealerCards,
            dealerScore,
            playerCards,
            playerScore
        ) => {
            setScores([dealerScore, playerScore]);
        };

        backend.on('draw', drawListener);

        return () => {
            backend.remove('draw', drawListener);
        };
    }, [backend]);

    return (
        <main className='app'>
            <PlayingTable />
            <ScoreDisplay dealerScore={scores[0]} playerScore={scores[1]} />
            <VoteChart votes={[4, 6]} categories={['Draw', 'Pass']} />
            <Overlay open={true}>
                <p style={{ backgroundColor: 'white' }}></p>
            </Overlay>
            <LoadingOverlay open={!backendReady} />
        </main>
    );
};
