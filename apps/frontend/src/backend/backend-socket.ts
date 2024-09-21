import { CoinDecision, PlayerName, TheGameState } from '@internal/the-game';
import { EncodedCard } from '@internal/the-game/card';
import { EventEmitter } from '../util/event-emitter.js';

export type BackendSocketEvents = {
    draw: (
        drawingActor: PlayerName,
        bankCards: ReadonlyArray<EncodedCard>,
        bankScore: number,
        playerCards: ReadonlyArray<EncodedCard>,
        playerScore: number
    ) => void;
    vote: (drawVotes: number, passVotes: number, until: number) => void;
    coin: (decision: CoinDecision) => void;
};

export class BackendSocket extends EventEmitter<BackendSocketEvents> {
    private _socket: WebSocket | null;
    private readonly _url: string;
    private _messageListener: ((event: MessageEvent) => void) | null;
    private _closeListener: (() => void) | null;
    private _lastTimestamp: number;

    constructor(url: string) {
        super();
        this._socket = null;
        this._url = url;
        this._messageListener = null;
        this._closeListener = null;
        this._lastTimestamp = 0;
    }

    async connect(): Promise<void> {
        const socket = new WebSocket(this._url);
        const isOpen =
            socket.readyState === WebSocket.OPEN
                ? Promise.resolve()
                : new Promise<void>(resolve =>
                      socket.addEventListener('open', () => resolve(), { once: true })
                  );

        this._messageListener = (event: MessageEvent) => {
            if (typeof event.data === 'string') {
                this._onMessage(event.data);
            }
        };

        this._closeListener = () => {
            this._disconnectSocket(socket);
        };

        socket.addEventListener('message', this._messageListener);
        socket.addEventListener('close', this._closeListener);
        this._socket = socket;

        await isOpen;
    }

    disconnect(): void {
        if (this._socket == null) {
            return;
        }

        this._disconnectSocket(this._socket);
        this._socket = null;
    }

    private _disconnectSocket(socket: WebSocket): void {
        if (this._messageListener != null) {
            socket.removeEventListener('message', this._messageListener);
        }

        if (this._closeListener != null) {
            socket.removeEventListener('close', this._closeListener);
        }

        socket.close();
    }

    private _onMessage(message: string): void {
        console.log('MESSAGE', message);

        try {
            const event = JSON.parse(message);
            if ('action' in event && 'data' in event) {
                this._processEvent(event);
            } else {
                throw new Error('Received malformed event from backend');
            }
        } catch (error) {
            console.error(`Received non-JSON message from backend: ${message}`);
            console.error(error);
        }
    }

    private _processEvent(event: TheGameState): void {
        const timestamp = new Date(event.ts).getTime();
        if (timestamp < this._lastTimestamp) {
            return;
        }

        switch (event.action) {
            case 'DRAW':
                this.emit(
                    'draw',
                    event.player,
                    event.data.bank.cards,
                    event.data.bank.points,
                    event.data.human.cards,
                    event.data.human.points
                );
                break;
            case 'VOTING':
                this.emit(
                    'vote',
                    event.data.votings.current.draw,
                    event.data.votings.current.pass,
                    new Date(event.data.votings.until ?? Date.now()).getTime()
                );
                break;
            case 'COIN':
                this.emit('coin', event.data.decision);
                break;
            default:
                console.log('UNHANDLED EVENT', event);
                break;
        }

        this._lastTimestamp = timestamp;
    }
}
