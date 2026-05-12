import express from "express";
import cors from "cors";
import ProductRoutes from "./routes/ProductRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", ProductRoutes);

app.get("/", (req, res) => {
  res.send("백엔드 서버 실행 중");
});

export default app;