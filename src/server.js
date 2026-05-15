import express from "express";
import dotenv from "dotenv";
import productRouter from "./Routers/productRouter.js";
import articleRouter from "./Routers/articleRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/products", productRouter);
app.use("/article", articleRouter);
app.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});
