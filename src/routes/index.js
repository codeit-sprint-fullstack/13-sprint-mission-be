import express from "express";
import articleRoutes from "./article.routes.js";
import articleCommentRoutes from "./articleComment.routes.js";
import productCommentRoutes from "./productComment.routes.js";

const router = express.Router();

router.use("/articles", articleRoutes);

router.use("/articles/:articleId/comments", articleCommentRoutes);

router.use("/product/:productId/comments", productCommentRoutes);

export default router;
