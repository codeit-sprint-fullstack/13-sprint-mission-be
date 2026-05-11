import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

console.log("PORT:", PORT);
console.log("MONGODB_URI exists:", Boolean(process.env.MONGODB_URI));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB 연결 성공");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`서버 실행 중: port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  });