import { Express } from "express";
import type { Multer } from "multer";

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
      files?: Multer.File[];
    }
  }
}
