import express from "express";

import {
  createArticle,
  getArticle,
  getArticles,
  updateArticle,
  deleteArticle,
} from "../controllers/article.controller.js";

import validate from "../middlewares/validate.js";
import {
  createArticleSchema,
  updateArticleSchema,
  articleQuerySchema,
} from "../validators/article.schema.js";

import { idParamShcema } from "../validators/common.schema.js";

const router = express.Router();

router.post("/", validate({ body: createArticleSchema }), createArticle);
router.get("/", validate({ query: articleQuerySchema }), getArticles);
router.get("/:id", validate({ params: idParamShcema }), getArticle);
router.patch(
  "/:id",
  validate({ params: idParamShcema, body: updateArticleSchema }),
  updateArticle,
);
router.delete("/:id", validate({ params: idParamShcema }), deleteArticle);

export default router;
