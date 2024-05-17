import { Router } from 'express';
import rateLimiter from '../middleware/rateLimiter';
import workSpaceController from '../controllers/workSpaceController';

const router = Router();

router.post('/check-name', rateLimiter(), workSpaceController.checkName);
router.post('/add-workspace', rateLimiter(), workSpaceController.addWorkSpace);
export default router;
