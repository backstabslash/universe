import { Router } from 'express';
import userController from '../controllers/userController';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

router.get('/get-by-email', rateLimiter(), userController.getByEmail);
router.get('/get-by-id/:userId', rateLimiter(), userController.getById);
router.get('/roles', rateLimiter(), userController.getRoles);
router.put('/user', rateLimiter(), userController.updateUserInfo);

export default router;
