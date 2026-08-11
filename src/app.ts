import express from "express";
import dotenv from "dotenv";
import productRouter from "./Routers/product.router.js";
import articleRouter from "./Routers/article.router.js";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});
