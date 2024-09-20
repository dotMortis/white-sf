import { initProcessHanlder, processHandler } from '@bits_devel/process-handler';
import { WebServer } from './server.js';

const start = () => {
    let server: WebServer | null = null;
    initProcessHanlder();
    const ph = processHandler();
    ph.onStart(async () => {
        console.log('STARTING SERVER');
        server = new WebServer();
        server.init();
        await server.start();
        console.log('STARTED SERVER');
    });
    ph.addExitMiddleware(async () => {
        console.log('STOPPING SERVER');
        await server?.stop();
        console.log('STOPPED SERVER');
    });
    ph.gracefulStart();
};

start();
