import { generate, LogLevel } from '@bits_devel/logger';

const logLevels: ReadonlyArray<LogLevel> = [
    'debug',
    'trace',
    'info',
    'warn',
    'error',
    'fatal',
    'silent'
];

const logLevel: LogLevel = logLevels.find(level => process.env.LOG_LEVEL === level) ?? 'debug';

export const LOGGER = generate({
    app: 'white-sf',
    level: logLevel,
    path: process.env.LOG_PATH || './logs'
});
