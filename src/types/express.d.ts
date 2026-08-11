import { Express } from "express";

declare global {
  interface Error {
    status: number;
  }
  namespace Express {
    interface Request {
      auth?:
        | {
            id: number;
          }
        | undefined;
    }
  }
}
