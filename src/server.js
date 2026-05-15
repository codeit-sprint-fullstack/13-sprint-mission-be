import express from "express";
import dotenv from "dotenv";
import productRouter from "./Routers/product.router.js";
import articleRouter from "./Routers/article.router.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/products", productRouter);
app.use("/articles", articleRouter);
app.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});
