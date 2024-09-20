import { initProcessHanlder, processHandler } from '@bits_devel/process-handler';
import { run } from './server.js';

const start = () => {
    initProcessHanlder();
    const ph = processHandler();
    ph.onStart(run);
    ph.addExitMiddleware(async () => console.log('Bye!'));
    ph.gracefulStart();
};

start();
