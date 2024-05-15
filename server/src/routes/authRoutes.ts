import { Router } from "express";
import authController from "../controllers/authController";
import rateLimiter from "../middleware/rateLimiter";

const router = Router();

router.post("/login", rateLimiter(), authController.login);
router.post("/register", rateLimiter(), authController.register);

export default router;
