// src/routes/products.routes.ts
import { Router } from "express";
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
  isLiked,
} from "../controller/product.controller";

const router = Router();

/**
 * IMPORTANT: register specific endpoints BEFORE generic /:id routes
 * so that requests like /api/products/is-liked do not match /:id
 */

// Body-based endpoints (accept productId in body or query)
router.get("/isLiked", isLiked);
router.post("/like", likeProduct);
router.post("/unlike", unlikeProduct);
router.get("/", getAllProducts);

// // Upload image for existing product (uses your middleware)
router.post("/:id/image", uploadProductImage);

// // Get by author (specific)
router.get("/author/:authorId", getByAuthor);

// // List paginated


// // Create product (no image)
router.post("/", createProduct);

// Generic product routes (these must come after specific ones)
router.get("/:id", getProductById);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
