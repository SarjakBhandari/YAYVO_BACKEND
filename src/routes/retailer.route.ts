import { Router } from "express";
import {
  createRetailer,
  getRetailers,
  getRetailerById,
  getRetailerByUsername,
  updateRetailer,
  deleteRetailer,
} from "../controller/retailer.controller";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
  retailerOnlyMiddleware,
} from "../middlewares/authorized.middleware";

const router = Router();

/**
 * Routes for retailer management
 * - Create retailer: only admin can create
 * - Get all retailers: only admin
 * - Get retailer by ID: retailer can view their own, admin can view any
 * - Get retailer by username: retailer can view their own, admin can view any
 * - Update retailer: retailer can update their own, admin can update any
 * - Delete retailer: only admin
 */

// Admin creates a retailer
router.post("/", authorizedMiddleware, adminOnlyMiddleware, createRetailer);

// Admin gets all retailers
router.get("/", authorizedMiddleware, adminOnlyMiddleware, getRetailers);

// Retailer or admin gets retailer by ID
router.get("/:id", authorizedMiddleware, retailerOnlyMiddleware, getRetailerById);

// Retailer or admin gets retailer by username
router.get("/username/:username", authorizedMiddleware, retailerOnlyMiddleware, getRetailerByUsername);

// Retailer updates their own profile, admin can update any
router.put("/:id", authorizedMiddleware, retailerOnlyMiddleware, updateRetailer);

// Admin deletes a retailer
router.delete("/:id", authorizedMiddleware, adminOnlyMiddleware, deleteRetailer);

export default router;
