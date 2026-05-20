import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productRouter from "./routes/products.js";
import articleRouter from "./routes/articles.js";

dotenv.config();

const app = express();

app.use(cors()); // cors실행 -> 브라우더 요청 전부 허용
app.use(express.json()); // express실행 -> json 내장 메서드 사용 (json데이터 읽을 수 있는 기능)

app.use("/products", productRouter);
app.use("/articles", articleRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

export default app;
