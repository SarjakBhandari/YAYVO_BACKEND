import express from "express";
import {
  saveReview,
  unsaveReview,
  saveProduct,
  unsaveProduct,
  getSavedReviews,
  getSavedProducts,
} from "../controller/collection.controller";

const router = express.Router();

router.post("/review/save", saveReview);
router.post("/review/unsave", unsaveReview);

router.post("/product/save", saveProduct);
router.post("/product/unsave", unsaveProduct);

router.get("/:consumerAuthId/reviews", getSavedReviews);
router.get("/:consumerAuthId/products", getSavedProducts);

export default router;
