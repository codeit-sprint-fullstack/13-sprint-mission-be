export const createError = (message, status) =>
  Object.assign(new Error(message), { status, isOperational: true });
