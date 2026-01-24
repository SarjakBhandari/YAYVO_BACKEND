import { Router } from "express";
import {
  createConsumer,
  getConsumers,
  getConsumerById,
  getConsumerByUsername,
  updateConsumer,
  deleteConsumer,
  updateConsumerProfilePicture, 
  getConsumerWithAuthIdController
} from "../controller/consumer.controller";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
  consumerOnlyMiddleware,
} from "../middlewares/authorized.middleware";
import { uploadProfilePicture } from "../middlewares/upload.middleware";

const router = Router();

/**
 * Routes for consumer management
 * - Create consumer: only admin can create
 * - Get all consumers: only admin
 * - Get consumer by ID: consumer can view their own, admin can view any
 * - Get consumer by username: consumer can view their own, admin can view any
 * - Update consumer: consumer can update their own, admin can update any
 * - Update profile picture: consumer can update their own
 * - Delete consumer: only admin
 */

// Admin creates a consumer
router.post("/", authorizedMiddleware, adminOnlyMiddleware, createConsumer);

// Admin gets all consumers
router.get("/", authorizedMiddleware, adminOnlyMiddleware, getConsumers);

// Consumer or admin gets consumer by ID
router.get("/:id", authorizedMiddleware, consumerOnlyMiddleware, getConsumerById);

router.get("/username/:username", authorizedMiddleware, consumerOnlyMiddleware, getConsumerByUsername);

router.put("/:id", authorizedMiddleware, consumerOnlyMiddleware, updateConsumer);

router.put(
  "/:id/profile-picture",
  authorizedMiddleware,
  consumerOnlyMiddleware,
  uploadProfilePicture.single("profilePicture"),
  updateConsumerProfilePicture
);
router.get("/auth/:authId", authorizedMiddleware, getConsumerWithAuthIdController);


// Admin deletes a consumer
router.delete("/:id", authorizedMiddleware, adminOnlyMiddleware, deleteConsumer);

export default router;