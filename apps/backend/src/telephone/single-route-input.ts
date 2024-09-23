import { InputFromStarfacePbx } from './starface-pbx-input.js';

export const SingleRouteActionValues = [
    'REGISTER',
    'HANG_UP',
    'DRAW',
    'PASS',
    'STATE',
    'START'
] as const;

export type SingleRouteAction = 'REGISTER' | 'HANG_UP' | 'DRAW' | 'PASS' | 'STATE' | 'START';

export type SingleRouteInpu = InputFromStarfacePbx & {
    action: SingleRouteAction;
};
