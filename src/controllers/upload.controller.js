const uploadService = require("../services/upload.service");

function uploadImages(req, res) {
  res.status(201).json({ imageUrls: uploadService.imageUrlsFromRequest(req) });
}

module.exports = { uploadImages };
