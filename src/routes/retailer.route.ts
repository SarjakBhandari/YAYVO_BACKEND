import { Router } from "express";
import {
  createRetailer,
  getRetailers,
  getRetailerById,
  getRetailerByUsername,
  updateRetailer,
  deleteRetailer
} from "../controller/retailer.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();

router.post("/", authorizedMiddleware, createRetailer);
router.get("/", authorizedMiddleware, getRetailers);
router.get("/:id", authorizedMiddleware, getRetailerById);
router.get("/username/:username", authorizedMiddleware, getRetailerByUsername);
router.put("/:id", authorizedMiddleware, updateRetailer);
router.delete("/:id", authorizedMiddleware, deleteRetailer);

export default router;
