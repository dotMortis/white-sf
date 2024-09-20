import { RequestHandler } from 'express';

export type ApiRequestHandler<
    P = Record<string, unknown>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = Record<string, unknown>,
    Locals extends Record<string, any> = { a: number }
> = RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>;
