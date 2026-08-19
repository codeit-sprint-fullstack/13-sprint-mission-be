import type { RequestHandler } from 'express';
import { create, type Struct } from 'superstruct';

export function validateBody<T, S>(struct: Struct<T, S>): RequestHandler {
    return function (req, res, next) {
        try {
            req.body = create(req.body, struct);
            next();
        } catch (error) {
            next(error);
        }
    };
}
