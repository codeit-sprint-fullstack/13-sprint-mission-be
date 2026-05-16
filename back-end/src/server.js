import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 라우터
app.use("/api/articles", articleRoutes);

app.use("/api/articles/:articleId/comments", commentRoutes);

// 메인 화면 테스트용
app.get("/", (req, res) => {
  res.send("메인 화면 테스트!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 서버 구동 중: http://localhost:${PORT}`),
);
