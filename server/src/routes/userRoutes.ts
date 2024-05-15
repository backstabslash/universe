import { Router } from "express";
import userController from "../controllers/userController";
import rateLimiter from "../middleware/rateLimiter";

const router = Router();

router.get("/get-by-tag", rateLimiter(), userController.getByTag);
router.get("/get-by-id", rateLimiter(), userController.getById);

export default router;
