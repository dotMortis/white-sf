import { RequestHandler } from 'express';

export type ApiRequestBody = Record<string, unknown>;

export type ApiReponseBody = Record<string, unknown>;

export type ApiReqQury = Record<string, unknown>;

export type ApiLocal = Record<string, unknown>;

export type ApiParams = Record<string, unknown>;

export type ApiRequestHandler<
    UrlParams = ApiParams,
    ResponseBody = ApiReponseBody,
    RequestBody = ApiRequestBody,
    RequestQueryParams = ApiReqQury,
    Locals extends Record<string, unknown> = ApiLocal
> = RequestHandler<UrlParams, ResponseBody, RequestBody, RequestQueryParams, Locals>;
