import type { Request } from "express";

function imageUrlsFromRequest(req: Request): string[] {
  const files = Array.isArray(req.files) ? req.files : [];
  return files.map(
    (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
  );
}

export { imageUrlsFromRequest };
