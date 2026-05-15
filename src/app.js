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

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: envFile });

const app = express();
app.use(cors());
app.use(express.json());

app.get("/product", validate(getProductsSchema, "query"), getProducts);
app.get("/product/:id", getProductById);
//create
app.post("/product", validate(createProductSchema), createProduct);
//update
app.patch("/product/:id", validate(updateProductSchema), updateProduct);
//delete
app.delete("/product/:id", deleteProduct);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port ${PORT}`,
  );
});
