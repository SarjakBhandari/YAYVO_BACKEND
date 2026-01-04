import { Router } from "express";
import {
  createConsumer,
  getConsumers,
  getConsumerById,
  getConsumerByUsername,
  updateConsumer,
  deleteConsumer
} from "../controller/consumer.controller";
import { authorizedMiddleware } from "../middlewares/authorized.middleware";

const router = Router();

router.post("/", authorizedMiddleware, createConsumer);
router.get("/", authorizedMiddleware, getConsumers);
router.get("/:id", authorizedMiddleware, getConsumerById);
router.get("/username/:username", authorizedMiddleware, getConsumerByUsername);
router.put("/:id", authorizedMiddleware, updateConsumer);
router.delete("/:id", authorizedMiddleware, deleteConsumer);

export default router;
