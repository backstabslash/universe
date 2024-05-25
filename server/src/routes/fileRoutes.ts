import { Router } from "express";
import fileController from "../controllers/fileController";
import rateLimiter from "../middleware/rateLimiter";
import upload from "../middleware/filesUpload";

const router = Router();

router.post("/upload", upload.array("files"), rateLimiter(), fileController.upload);
router.get("/download/:fileId", fileController.download);

export default router;
