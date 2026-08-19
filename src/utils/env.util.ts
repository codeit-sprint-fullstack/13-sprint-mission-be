import dotenv from "dotenv";
import path from "path";

dotenv.config({ quiet: true });

const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "local-panda-market-secret";
const uploadDir =
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads");

export { jwtSecret, port, uploadDir };
