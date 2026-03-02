import express from "express";
import {
  saveReview,
  unsaveReview,
  saveProduct,
  unsaveProduct,
  getSavedReviews,
  getSavedProducts,
} from "../controller/collection.controller";
import { validateZod } from "../middlewares/validateCollections.middleware";
import {
  SaveReviewSchema,
  UnsaveReviewSchema,
  SaveProductSchema,
  UnsaveProductSchema,
} from "../dtos/collection.dtos";

const router = express.Router();

router.post("/review/save", validateZod(SaveReviewSchema), saveReview);
router.post("/review/unsave", validateZod(UnsaveReviewSchema), unsaveReview);

router.post("/product/save", validateZod(SaveProductSchema), saveProduct);
router.post("/product/unsave", validateZod(UnsaveProductSchema), unsaveProduct);

router.get("/:consumerAuthId/reviews", getSavedReviews);
router.get("/:consumerAuthId/products", getSavedProducts);

export default router;
