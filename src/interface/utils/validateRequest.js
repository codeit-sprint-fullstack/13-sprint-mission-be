import { create } from 'superstruct';

export function validateBody(struct) {
    return function (req, res, next) {
        try {
            req.body = create(req.body, struct);
            next();
        } catch (error) {
            next(error);
        }
    };
}
