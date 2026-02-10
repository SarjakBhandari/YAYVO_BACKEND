import { Router } from "express";
import {
  login,
  registerConsumer,
  registerRetailer,
  logout,
  getCurrentUser,
  sendResetPasswordEmail,
  resetPassword
} from "../controller/auth.controller"; 
import { authorizedMiddleware } from "../middlewares/authorized.middleware"; 
const router = Router();

router.post("/login", login);
router.post("/register/consumer", registerConsumer);
router.post("/register/retailer", registerRetailer);
router.post("/logout", authorizedMiddleware, logout);       
router.get("/current-user", authorizedMiddleware, getCurrentUser); 
router.post("/request-password-reset", sendResetPasswordEmail);
router.post("/reset-password/:token", resetPassword);

export default router;
