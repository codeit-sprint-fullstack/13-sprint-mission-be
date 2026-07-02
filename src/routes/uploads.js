const express = require("express");
const { imageUpload } = require("../config/upload");
const { requireAuth } = require("../middlewares/auth");
const uploadService = require("../services/uploadService");

const router = express.Router();

router
  .route("/images")
  .post(requireAuth, imageUpload.array("images", 3), (req, res) => {
    res
      .status(201)
      .json({ imageUrls: uploadService.imageUrlsFromRequest(req) });
  });

module.exports = router;
