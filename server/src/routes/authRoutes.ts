import { Router } from 'express';
import authController from '../controllers/authController';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

router.post('/login', rateLimiter(), authController.login);
router.post('/register', rateLimiter(), authController.register);
router.get('/logout', rateLimiter(), authController.logout);
router.get('/refresh', rateLimiter(), authController.refreshAccessToken);

export default router;
