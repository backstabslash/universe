import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/refresh', authController.refreshAccessToken);

export default router;
