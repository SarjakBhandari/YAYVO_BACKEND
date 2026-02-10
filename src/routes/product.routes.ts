import { Router } from 'express';
import {
  createProduct,
  uploadProductImage,
  getAllProducts,
  getProductById,
  getByAuthor,
  updateProduct,
  deleteProduct,
  likeProduct,
  unlikeProduct,
  isLiked
} from '../controller/product.controller';

const router = Router();

// Create product (no image)
router.post('/', createProduct);

// Upload image for existing product (uses your middleware)
router.post('/:id/image', uploadProductImage);

// List paginated
router.get('/', getAllProducts);

// Get by id
router.get('/:id', getProductById);

// Get by author
router.get('/author/:authorId', getByAuthor);

// Update (fields only)
router.put('/:id', updateProduct);

// Delete
router.delete('/:id', deleteProduct);

// Like / Unlike
router.post('/like', likeProduct);
router.post('/unlike', unlikeProduct);

// Is liked
router.get('/is-liked', isLiked);

export default router;
