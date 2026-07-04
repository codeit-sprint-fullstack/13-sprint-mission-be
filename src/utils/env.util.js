import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ quiet: true });

const __filename = fileURLToPath(import.meta.url);
const __driname = path.dirname(__filename);

const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET || "local-panda-market-secret";
const uploadDir =
  process.env.UPLOAD_DIR || path.join(__driname, "..", "..", "uploads");

export { jwtSecret, port, uploadDir };
