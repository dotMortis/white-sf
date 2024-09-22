import { InputFromStarfacePbx } from './starface-pbx-input.js';

export const SingleRouteActionValues = ['REGISTER', 'HANG_UP', 'DRAW', 'PASS', 'STATE'] as const;

export type SingleRouteAction = 'REGISTER' | 'HANG_UP' | 'DRAW' | 'PASS' | 'STATE';

export type SingleRouteInpu = InputFromStarfacePbx & {
    action: SingleRouteAction;
};
