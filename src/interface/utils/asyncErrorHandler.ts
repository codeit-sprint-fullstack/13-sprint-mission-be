import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<unknown>;

export function asyncErrorHandler(handler: AsyncRequestHandler): RequestHandler {
    return async function (req, res, next) {
        try {
            await handler(req, res, next);
        } catch (e) {
            next(e);
        }
    };
}
