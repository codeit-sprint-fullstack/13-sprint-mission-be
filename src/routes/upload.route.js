const express = require("express");
const uploadController = require("../controllers/upload.controller");
const { imageUpload } = require("../utils/upload.util");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/images")
  .post(
    requireAuth,
    imageUpload.array("images", 3),
    uploadController.uploadImages,
  );

module.exports = router;
