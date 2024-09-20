import express, { Application } from 'express';
import { Server } from 'http';
import { resolve } from 'path';
import { WebSocketServer } from 'ws';
import { ErrorHandler } from './middleware/error-handler.js';
import { TELEFON_ROUTER } from './routes/telefon.routes.js';

export class WebServer {
    private readonly _expressApp: Application;
    private readonly _wss: WebSocketServer;
    private readonly _baseRoute: string;
    private readonly _port: number;
    private _server: Server | null;

    constructor(baseRoute: string, port: number) {
        this._expressApp = express();
        this._wss = new WebSocketServer({ noServer: true });
        this._server = null;
        this._port = port;
        this._baseRoute = this._sanatizeBaseUrl(baseRoute, port);
    }

    init(): void {
        this._expressApp.use(express.json());
        this._expressApp.use(
            '/static',
            express.static(resolve(import.meta.dirname, '..', 'assets'))
        );
        this._expressApp.use(TELEFON_ROUTER);
        this._expressApp.use(ErrorHandler);
    }

    start(): Promise<void> {
        return new Promise<void>((res, rej) => {
            try {
                this._server ??= this._expressApp.listen(this._port, res);
                this._addWssHandler(this._server);
            } catch (error) {
                rej(error);
            }
        });
    }

    stop(): Promise<void> {
        return new Promise<void>((res, rej) => {
            this._wss.clients.forEach(client => client.close());
            if (this._server !== null) {
                this._server.closeAllConnections();
                this._server.close((err?: Error) => {
                    if (err != null) {
                        rej(err);
                    } else {
                        res();
                    }
                });
                this._server = null;
            } else {
                res();
            }
        });
    }

    private _addWssHandler(server: Server): void {
        server.on('upgrade', (request, socket, head) => {
            this._wss.handleUpgrade(request, socket, head, socket => {
                const { pathname } = new URL(request.url ?? '', `ws://${this._baseRoute}`);

                if (pathname === '/whitefs') {
                    socket.on('message', data => {
                        const dataStr = String(data);
                        console.log('GOT DATA', dataStr);
                        socket.send('ACK');
                    });
                }
            });
        });
    }

    private _sanatizeBaseUrl(baseUrl: string, port: number): string {
        let sanatizedUrl = baseUrl.replaceAll(/ +/gm, '');
        const httpsPrefix = 'https://';
        const httpPrefix = 'http://';
        if (sanatizedUrl.startsWith(httpsPrefix)) {
            sanatizedUrl = sanatizedUrl.slice(httpsPrefix.length - 1);
        } else if (sanatizedUrl.startsWith(httpPrefix)) {
            sanatizedUrl = sanatizedUrl.slice(httpPrefix.length - 1);
        }
        if (sanatizedUrl.endsWith('/')) {
            return sanatizedUrl.slice(0, -1);
        }
        if (!sanatizedUrl.endsWith(`:${port}`)) {
            return sanatizedUrl + `:${port}`;
        }
        return sanatizedUrl;
    }
}
