import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.listen(8080, () => {
  console.log("🚀 백엔드 서버 실행: http://localhost:8080");
});
