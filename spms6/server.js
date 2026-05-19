import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRouter from "./src/routes/productRouter.js";
import articleRouter from "./src/routes/articleRouter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 ${PORT}에서 잘 동작하고 있어요`);
});
