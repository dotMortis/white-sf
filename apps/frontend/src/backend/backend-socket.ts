export class BackendSocket {
    private _socket: WebSocket | null;
    private readonly _url: string;

    constructor(url: string) {
        this._socket = null;
        this._url = url;
    }

    connect(): Promise<void> {
        const socket = new WebSocket(this._url);

        return new Promise<void>((_, reject) => setTimeout(reject, 500));
    }
}
