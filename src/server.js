import express from "express";
import dotenv from "dotenv";
import { createProduct } from "./controllers/product.controller.js";
import productRouter from "./Routers/productRouters.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/products", productRouter);

app.listen(PORT, () => {
  console.log(`✅Server running on port ${PORT}`);
});
