import { Router } from "express";
import {
  createRetailer,
  getRetailers,
  getRetailerById,
  getRetailerByAuthId,
  getRetailerByUsername,
  updateRetailer,
  updateRetailerProfilePicture,
  deleteRetailer,
} from "../controller/retailer.controller";
import {
  authorizedMiddleware,
  adminOnlyMiddleware,
  retailerOnlyMiddleware,
} from "../middlewares/authorized.middleware";
import { uploadProfilePicture } from "../middlewares/upload.middleware";

const router = Router();

// Retailer or admin gets retailer by Mongo _id
router.get("/:id", authorizedMiddleware, retailerOnlyMiddleware, getRetailerById);

// Retailer or admin gets retailer by authId
router.get("/auth/:authId", authorizedMiddleware, retailerOnlyMiddleware, getRetailerByAuthId);

// Retailer or admin gets retailer by username
router.get("/username/:username", authorizedMiddleware, retailerOnlyMiddleware, getRetailerByUsername);

// Retailer updates their own profile by Mongo _id
router.put("/:id", authorizedMiddleware, retailerOnlyMiddleware, updateRetailer);


// Retailer updates their own profile picture by authId
router.put(
  "/auth/:id/profile-picture",
  authorizedMiddleware,
  retailerOnlyMiddleware,
  uploadProfilePicture.single("profilePicture"),
  updateRetailerProfilePicture
);

// Admin deletes a retailer by Mongo _id
router.delete("/:id", authorizedMiddleware, adminOnlyMiddleware, deleteRetailer);

export default router;
