import { Router } from "express";
import { productController } from "../controllers/productController";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.array("images", 5),
  productController.createProduct,
);

router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

router.patch("/:id", authenticate, productController.updateProduct);
router.delete("/:id", authenticate, productController.deleteProduct);

export default router;
