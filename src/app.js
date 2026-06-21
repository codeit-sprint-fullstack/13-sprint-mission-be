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
import {
  createArticle,
  deleteArticle,
  getArticle,
  getArticleById,
  updateArticle,
} from "./controllers/aritcleController.js";
import {
  createArticleSchema,
  getArticleSchema,
  updateArticleSchema,
} from "./schemas/article.Schema.js";
import {
  createCommentSchema,
  getCommentsSchema,
  updateCommentSchema,
} from "./schemas/articleCommet.Schema.js";
import {
  createArticleComment,
  deleteArticleComment,
  getArticleComments,
  updateArticleComment,
} from "./controllers/aritcleCommentController.js";

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

// Article
// Create
app.post("/articles", validate(createArticleSchema), createArticle);
// Read
app.get("/articles", validate(getArticleSchema, "query"), getArticle);
app.get("/articles/:id", getArticleById);
// Update
app.patch("/articles/:id", validate(updateArticleSchema), updateArticle);
// Delete
app.delete("/articles/:id", deleteArticle);

// Article Comment
// Create
app.post(
  "/articles/:articleId/comments",
  validate(createCommentSchema),
  createArticleComment,
);
// Read
app.get(
  "/articles/:articleId/comments",
  validate(getCommentsSchema, "query"),
  getArticleComments,
);
// Update
app.patch(
  "/articles/comments/:id",
  validate(updateCommentSchema),
  updateArticleComment,
);
// Delete
app.delete("/articles/comments/:id", deleteArticleComment);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(
    `[${process.env.NODE_ENV || "development"}] Server running on port ${PORT}`,
  );
});
