import { once } from 'events';
import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { WebSocket } from 'ws';
import { WebServer } from '../src/server.js';

describe('Webserver tests', () => {
    let webserver: WebServer;
    beforeEach(() => {
        webserver = new WebServer('localhost', 3000);
        webserver.init();
    });
    afterEach(async () => {
        await webserver?.stop();
    });
    describe('http tests', () => {
        test('should start and stop webserver', async () => {
            //arrange
            //act and assert
            await expect(webserver.start()).resolves.not.toThrow();
            await expect(webserver.stop()).resolves.not.toThrow();
        });
        test('/register should return data', async () => {
            //arrange
            await webserver.start();
            //act
            const result = await fetch('http://localhost:3000/register', {
                method: 'get'
            });
            //assert
            await expect(result.json()).resolves.toStrictEqual({ status: 'JEA' });
        });
        test('/static should return data', async () => {
            //arrange
            await webserver.start();
            //act
            const result = await fetch('http://localhost:3000/static/ping.json', {
                method: 'get'
            });
            //assert
            await expect(result.json()).resolves.toStrictEqual({ status: 'PONG' });
        });
    });
    describe('ws tests', () => {
        test('should connect to socket', async () => {
            //arrange
            await webserver.start();
            //act
            const ws = new WebSocket('ws://localhost:3000/whitefs');
            //assert
            await expect(once(ws, 'open')).resolves.not.toThrow();
        });
        test('should ping ponger', async () => {
            //arrange
            await webserver.start();
            const ws = new WebSocket('ws://localhost:3000/whitefs');
            await once(ws, 'open');
            //act
            const messageProm = new Promise<string>(res => {
                ws.once('message', data => res(String(data)));
            });
            ws.send('ping');
            //assert
            await expect(messageProm).resolves.toBe('pong');
        });
        test('should close connection on serer stop', async () => {
            //arrange
            await webserver.start();
            const ws = new WebSocket('ws://localhost:3000/whitefs');
            await once(ws, 'open');
            //act
            const onceClose = once(ws, 'close');
            const closeProm = webserver.stop();
            //assert
            await expect(onceClose).resolves.not.toThrow();
            await closeProm;
        });
    });
});
