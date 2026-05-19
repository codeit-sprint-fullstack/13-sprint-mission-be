import express from "express";
import {
  deleteProduct,
  getAllProducts,
  getProduct,
  postProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const ProductRouter = express.Router();

ProductRouter.get("/", getAllProducts);
ProductRouter.get("/:id", getProduct);

ProductRouter.post("/", postProduct);

ProductRouter.patch("/:id", updateProduct);

ProductRouter.delete("/:id", deleteProduct);

export default ProductRouter;
