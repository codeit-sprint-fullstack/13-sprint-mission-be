const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { uploadDir } = require("./env");
const { HttpError } = require("../middlewares/error");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { files: 3, fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new HttpError(400, "이미지 파일만 업로드할 수 있습니다."));
      return;
    }
    cb(null, true);
  },
});

module.exports = { imageUpload };
