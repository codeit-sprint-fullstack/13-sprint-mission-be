// routes/product.js
import { Router, RequestHandler } from "express";
import {
  getProduct,
  getProducts,
  deleteProduct,
  updateProduct,
  createProduct,
  likeProduct,
  unlikeProduct,
} from "../controllers/product.controller.js";
import {
  createProductComment,
  getProductComments,
} from "../controllers/comment.controller.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../schemas/product.schema.js";
import { createProductCommentSchema } from "../schemas/comment.schema.js";
import { validate } from "../middlewares/validate.js";
import { verifyAccessToken, optionalAuthenticate } from "../middlewares/auth.js";

const router = Router();

// 상품 관련 API
router.get("/", getProducts);
router.get("/:productId", optionalAuthenticate, getProduct);
router.post(
  "/",
  verifyAccessToken,
  validate(createProductSchema),
  createProduct as RequestHandler,
);
router.patch(
  "/:productId",
  verifyAccessToken,
  validate(updateProductSchema),
  updateProduct as RequestHandler,
);
router.delete("/:productId", verifyAccessToken, deleteProduct as RequestHandler);

// 요구사항(좋아요 기능): 로그인한 사용자만 상품에 좋아요를 추가/삭제할 수 있음
// -> 상품 쪽은 API 스펙 상 "favorite" 용어 사용 (게시글은 "like")
router.post("/:productId/favorite", verifyAccessToken, likeProduct as RequestHandler);
router.delete("/:productId/favorite", verifyAccessToken, unlikeProduct as RequestHandler);

// 상품 댓글 관련 API (생성/목록만 여기서, 수정/삭제는 /comments/:commentId 로 통합)
router.get("/:productId/comments", getProductComments);
router.post(
  "/:productId/comments",
  verifyAccessToken,
  validate(createProductCommentSchema),
  createProductComment as RequestHandler,
);

export default router;
