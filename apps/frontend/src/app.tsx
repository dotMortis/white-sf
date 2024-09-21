import { CoinDecision, PlayerName } from '@internal/the-game';
import { EncodedCard } from '@internal/the-game/card';
import { useEffect, useState } from 'preact/hooks';
import './app.css';
import { BackendSocketEvents } from './backend/backend-socket.js';
import { CoinFlip } from './components/coin-flip/coin-flip.js';
import { LoadingOverlay } from './components/loading-overlay/loading-overlay.js';
import { Overlay } from './components/overlay/overlay.js';
import { PlayerCount } from './components/player-count/player-count.js';
import { PlayingTable } from './components/playing-table/playing-table.js';
import { ResultDisplay } from './components/result-display/result-display.js';
import { ScoreDisplay } from './components/score-display/score-display.js';
import { VoteChart } from './components/vote-chart/vote-chart.js';
import { useBackend } from './hooks/use-backend.js';
import { EventListener } from './util/listenable.js';

const WebsocketUrl = 'ws://localhost:3000';

export const App = () => {
    const [backend, backendReady] = useBackend(WebsocketUrl);
    const [scores, setScores] = useState([0, 0]);
    const [playerCards, setPlayerCards] = useState<ReadonlyArray<EncodedCard>>([]);
    const [dealerCards, setDealerCards] = useState<ReadonlyArray<EncodedCard>>([]);
    const [votes, setVotes] = useState<readonly [draw: number, pass: number, until: number] | null>(
        null
    );
    const [decision, setDecision] = useState<CoinDecision | null>(null);
    const [winner, setWinner] = useState<PlayerName | 'DRAW' | null>(null);
    const [playerCount, setPlayerCount] = useState<
        readonly [current: number, required: number] | null
    >(null);

    useEffect(() => {
        const drawListener: EventListener<BackendSocketEvents, 'draw'> = (
            drawingActor,
            dealerCards,
            dealerScore,
            playerCards,
            playerScore
        ) => {
            setScores([dealerScore, playerScore]);
            setDealerCards(dealerCards);
            setPlayerCards(playerCards);
            setVotes(null);
            setDecision(null);
            setPlayerCount(null);
        };

        const voteListener: EventListener<BackendSocketEvents, 'vote'> = (
            drawVotes,
            passVotes,
            until
        ) => {
            setVotes([drawVotes, passVotes, until]);
        };

        const coinListener: EventListener<BackendSocketEvents, 'coin'> = decision => {
            setVotes(null);
            setDecision(decision);
        };

        const resultListener: EventListener<BackendSocketEvents, 'result'> = winner => {
            setWinner(winner);
            setVotes(null);
            setDecision(null);
        };

        const waitingListener: EventListener<BackendSocketEvents, 'waiting'> = (
            players,
            minimum
        ) => {
            setPlayerCount([players, minimum]);
        };

        backend.on('draw', drawListener);
        backend.on('vote', voteListener);
        backend.on('coin', coinListener);
        backend.on('result', resultListener);
        backend.on('waiting', waitingListener);

        return () => {
            backend.remove('draw', drawListener);
            backend.remove('vote', voteListener);
            backend.remove('coin', coinListener);
            backend.remove('result', resultListener);
            backend.remove('waiting', waitingListener);
        };
    }, [backend]);

    return (
        <main className='app'>
            <PlayingTable dealerCards={dealerCards} playerCards={playerCards} />
            <ScoreDisplay dealerScore={scores[0]} playerScore={scores[1]} />
            {votes != null && (
                <VoteChart
                    votes={votes.slice(0, 2) as [number, number]}
                    categories={['Ziehen', 'Passen']}
                    until={votes[2]}
                />
            )}
            <Overlay open={decision != null || winner != null || playerCount != null}>
                {decision != null && <CoinFlip decision={decision} />}
                {winner != null && <ResultDisplay winner={winner} />}
                {playerCount != null && (
                    <PlayerCount count={playerCount[0]} required={playerCount[1]} />
                )}
            </Overlay>
            <LoadingOverlay open={!backendReady} />
        </main>
    );
};
