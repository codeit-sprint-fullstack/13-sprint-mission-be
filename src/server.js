import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongDB 연결 성공");

   app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
   });  

  })
  .catch((error) => {
    console.error("MongoDB 연결 실패", error);
  });

