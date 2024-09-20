import { generate } from '@bits_devel/logger';

export const LOGGER = generate({
    app: 'white-sf',
    level: 'debug',
    path: './logs'
});
