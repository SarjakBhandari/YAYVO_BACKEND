import { Router } from "express";
import {
  login,
  registerConsumer,
  registerRetailer,
  logout,
  getCurrentUser
} from "../controller/auth.controller"; 
import { authorizedMiddleware } from "../middlewares/authorized.middleware"; 
const router = Router();

router.post("/login", login);
router.post("/register/consumer", registerConsumer);
router.post("/register/retailer", registerRetailer);
router.post("/logout", authorizedMiddleware, logout);       
router.get("/current-user", authorizedMiddleware, getCurrentUser); 

export default router;
