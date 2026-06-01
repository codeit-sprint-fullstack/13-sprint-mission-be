import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import {
  createProductComment,
  deleteProductComment,
  getProductComments,
  updateProductComment,
} from '../controllers/productCommentController.js';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

router.post('/:productId/comments', createProductComment);
router.get('/:productId/comments', getProductComments);
router.patch('/:productId/comments/:commentId', updateProductComment);
router.delete('/:productId/comments/:commentId', deleteProductComment);

export default router;
