import * as uploadService from "../services/upload.service.js";

function uploadImages(req, res) {
  res.status(201).json({ imageUrls: uploadService.imageUrlsFromRequest(req) });
}

export { uploadImages };
