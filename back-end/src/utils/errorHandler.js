export const sendError = (res, status, message) =>
  res.status(status).json({ message });

export const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
