import { initProcessHanlder, processHandler } from '@bits_devel/process-handler';
import { CONFIG } from './config.js';
import { WebServer } from './server.js';
import { LOGGER } from './utils/logger.js';

const start = () => {
    let server: WebServer | null = null;
    initProcessHanlder();
    const ph = processHandler();
    ph.onStart(async () => {
        LOGGER.info({ config: CONFIG }, 'Initialize server');
        server = new WebServer(CONFIG.basePath, CONFIG.port);
        server.init();
        LOGGER.info('Starting server');
        await server.start();
        LOGGER.info('Server started successfully');
    });
    ph.addExitMiddleware(async () => {
        LOGGER.info('Stopping server');
        await server?.stop();
        LOGGER.info('Stopped server');
    });
    ph.gracefulStart();
};

start();
