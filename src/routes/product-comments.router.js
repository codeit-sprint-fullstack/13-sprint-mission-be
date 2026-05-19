import express from "express";
import {
  deleteProductComments,
  getProductComments,
  postProductComments,
  updateProductComments,
} from "../controllers/product-comments.controller.js";

//부모 라우터 server.js의 params를 자식 라우터 ProductComment에서도 접근할 수 있게 해주는 옵션
const ProductCommentRouter = express.Router({ mergeParams: true });

ProductCommentRouter.get("/", getProductComments);

ProductCommentRouter.post("/", postProductComments);

ProductCommentRouter.patch("/:id", updateProductComments);

ProductCommentRouter.delete("/:id", deleteProductComments);

export default ProductCommentRouter;
