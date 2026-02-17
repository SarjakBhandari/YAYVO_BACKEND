// routes/review.routes.ts
import express from "express";
import {
  createReview,
  getReviewById,
  getReviewsByAuthor,
  listReviewsPaginated,
  isLikedByUser,
  likeReview,
  unlikeReview,
  updateReview,
  deleteReview,
  uploadReviewImage,
} from "../controller/review.controller";
import { uploadReviewPicture } from "../middlewares/review_upload.middleware";

const router = express.Router();

router.post("/", createReview);
router.get("/paginated", listReviewsPaginated);
router.get("/author/:authorId", getReviewsByAuthor);

router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

router.post("/:id/image", uploadReviewPicture.single("image"), uploadReviewImage);

router.get("/:id/islikedby/:userId", isLikedByUser);
router.post("/:id/like", likeReview);
router.post("/:id/unlike", unlikeReview);

export default router;
