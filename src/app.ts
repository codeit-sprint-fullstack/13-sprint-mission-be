import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import commentRoutes from "./routes/commentRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => {
  res.send("Panda Market Backend Server is Running!");
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/", commentRoutes);

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "요청하신 API 라우트를 찾을 수 없습니다.",
  });
});

app.use(errorHandler);

export default app;
