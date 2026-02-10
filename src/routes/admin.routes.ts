import { Router } from "express";
import {
  createConsumer,
  getConsumers,
  getConsumerById,
  getConsumerByUsername,
  updateConsumer,
  deleteConsumer,
  updateConsumerProfilePicture, 
  getConsumerWithAuthIdController,
  getAllConsumers
} from "../controller/consumer.controller";
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
} from "../middlewares/authorized.middleware";
import { uploadProfilePicture } from "../middlewares/upload.middleware";

const router = Router();


// Admin gets all consumers
router.get("/consumers", authorizedMiddleware, adminOnlyMiddleware, getConsumers);
router.get("/paginated_consumers", authorizedMiddleware, adminOnlyMiddleware, getAllConsumers);

// Consumer or admin gets consumer by ID
router.get("/consumers/:id", authorizedMiddleware, adminOnlyMiddleware, getConsumerById);

router.get("/consumers/username/:username", authorizedMiddleware, adminOnlyMiddleware, getConsumerByUsername);

router.put("/consumers/:id", authorizedMiddleware, adminOnlyMiddleware, updateConsumer);

router.put(
  "/consumers/auth/:id/profile-picture",
  authorizedMiddleware,
  adminOnlyMiddleware,
  uploadProfilePicture.single("profilePicture"),
  updateConsumerProfilePicture
);
router.get("/consumers/auth/:authId", authorizedMiddleware,adminOnlyMiddleware, getConsumerWithAuthIdController);


// Admin deletes a consumer
router.delete("/consumers/:id", authorizedMiddleware, adminOnlyMiddleware, deleteConsumer);

// Admin creates a retailer
router.post("/retailers", authorizedMiddleware, adminOnlyMiddleware, createRetailer);

// Admin gets all retailers
router.get("/retailers", authorizedMiddleware, adminOnlyMiddleware, getRetailers);

// Retailer or admin gets retailer by Mongo _id
router.get("/retailers/:id", authorizedMiddleware, adminOnlyMiddleware, getRetailerById);

// Retailer or admin gets retailer by authId
router.get("/retailers/auth/:authId", authorizedMiddleware, adminOnlyMiddleware, getRetailerByAuthId);

// Retailer or admin gets retailer by username
router.get("/retailers/username/:username", authorizedMiddleware, adminOnlyMiddleware, getRetailerByUsername);

// Retailer updates their own profile by Mongo _id
router.put("/retailers/:id", authorizedMiddleware, adminOnlyMiddleware, updateRetailer);


// Retailer updates their own profile picture by authId
router.put(
  "/retailers/auth/:id/profile-picture",
  authorizedMiddleware,
  uploadProfilePicture.single("profilePicture"),
  updateRetailerProfilePicture
);

// Admin deletes a retailer by Mongo _id
router.delete("/retailers/:id", authorizedMiddleware, adminOnlyMiddleware, deleteRetailer);



export default router;

