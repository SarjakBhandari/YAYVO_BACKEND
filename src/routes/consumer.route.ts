import { Router } from "express";
import {
  createConsumer,
  getConsumers,
  getConsumerById,
  getConsumerByUsername,
  updateConsumer,
  deleteConsumer,
} from "../controller/consumer.controller";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
  consumerOnlyMiddleware,
} from "../middlewares/authorized.middleware";

const router = Router();

/**
 * Routes for consumer management
 * - Create consumer: only admin can create
 * - Get all consumers: only admin
 * - Get consumer by ID: consumer can view their own, admin can view any
 * - Get consumer by username: consumer can view their own, admin can view any
 * - Update consumer: consumer can update their own, admin can update any
 * - Delete consumer: only admin
 */

// Admin creates a consumer
router.post("/", authorizedMiddleware, adminOnlyMiddleware, createConsumer);

// Admin gets all consumers
router.get("/", authorizedMiddleware, adminOnlyMiddleware, getConsumers);

// Consumer or admin gets consumer by ID
router.get("/:id", authorizedMiddleware, consumerOnlyMiddleware, getConsumerById);

// Consumer or admin gets consumer by username
router.get("/username/:username", authorizedMiddleware, consumerOnlyMiddleware, getConsumerByUsername);

// Consumer updates their own profile, admin can update any
router.put("/:id", authorizedMiddleware, consumerOnlyMiddleware, updateConsumer);

// Admin deletes a consumer
router.delete("/:id", authorizedMiddleware, adminOnlyMiddleware, deleteConsumer);

export default router;
