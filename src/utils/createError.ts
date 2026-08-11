export default function createError(status: number, message: string) {
  const error = new Error(message);
  error.status = status;
  return error;
}
