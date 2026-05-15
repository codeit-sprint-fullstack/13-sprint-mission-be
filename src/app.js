import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { validate } from "./middlewares/validate.js";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./controllers/productController.js";
import {
  createProductSchema,
  getProductsSchema,
  updateProductSchema,
} from "./schemas/product.Schema.js";
import { createArticle, getArticle } from "./controllers/aritcleController.js";
import {
  createArticleSchema,
  getArticleSchema,
} from "./schemas/article.Schema.js";

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(cors());
app.use(express.json());

//Product
app.get("/product", validate(getProductsSchema, "query"), getProducts);
app.get("/product/:id", getProductById);
//create
app.post("/product", validate(createProductSchema), createProduct);
//update
app.patch("/product/:id", validate(updateProductSchema), updateProduct);
//delete
app.delete("/product/:id", deleteProduct);

//Article

//Read
app.get("/article", validate(getArticleSchema, "query"), getArticle);

//Create
app.post("/article", validate(createArticleSchema), createArticle);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port ${PORT}`,
  );
});
