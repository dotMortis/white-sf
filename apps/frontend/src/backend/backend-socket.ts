export class BackendSocket {
    private _socket: WebSocket | null;

    constructor() {
        this._socket = null;
    }

    connect(): Promise<void> {
        return new Promise<void>((_, reject) => setTimeout(reject, 500));
    }
}
