import dotenv from "dotenv";
import express from "express";

//.env 파일 로드.
dotenv.config();

const app = express();
app.use(express.json());

app.get("/test", (req, res) => {
  res.json("성공!");
});

app.listen(process.env.port, () => {
  console.log("서버가 실행중 입니다.");
});
