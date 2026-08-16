import type { Requester } from './application.js';

declare global {
    namespace Express {
        interface Request {
            requester?: Requester;
        }
    }
}

export {};
