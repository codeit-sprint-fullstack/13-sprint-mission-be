const path = require("path");

module.exports = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "local-panda-market-secret",
  uploadDir:
    process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads"),
};
