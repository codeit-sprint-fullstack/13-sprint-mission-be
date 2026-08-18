export interface HttpError extends Error {
  status: number;
  isOperational: true;
}

export const createError = (message: string, status: number): HttpError =>
  Object.assign(new Error(message), { status, isOperational: true as const });

export const isHttpError = (err: unknown): err is HttpError =>
  err instanceof Error && (err as HttpError).isOperational === true;
