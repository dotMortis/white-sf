import { RequestHandler } from 'express';

export type ApiRequestBody = Record<string, unknown>;

export type ApiReponseBody = Record<string, unknown>;

export type ApiReqQury = Record<string, unknown>;

export type ApiLocal = Record<string, unknown>;

export type ApiParams = Record<string, unknown>;

export type ApiRequestHandler<
    Params = ApiParams,
    ResBody = ApiReponseBody,
    ReqBody = ApiRequestBody,
    ReqQuery = ApiReqQury,
    Locals extends Record<string, unknown> = ApiLocal
> = RequestHandler<Params, ResBody, ReqBody, ReqQuery, Locals>;
