import * as uploadService from "../services/upload.service";
import type { RequestHandler } from "express";

const uploadImages: RequestHandler = (req, res) => {
  res.status(201).json({ imageUrls: uploadService.imageUrlsFromRequest(req) });
};

export { uploadImages };
