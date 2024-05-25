import { Router } from 'express';
import channelController from '../controllers/channelController';
import rateLimiter from '../middleware/rateLimiter';

const router = Router();

router.get('/get-by-user-id', rateLimiter(), channelController.getByUserId);
router.post('/create', rateLimiter(), channelController.create);
router.delete('/delete-by-id', rateLimiter(), channelController.deleteById);
router.post(
  '/add-user-by-tag',
  rateLimiter(),
  channelController.inviteUserByTag
);
router.delete(
  '/exclude-user-by-tag',
  rateLimiter(),
  channelController.excludeUserByTag
);
router.post('/add-user', rateLimiter(), channelController.addUserToChannel);
router.get('/:channelId/messages', channelController.getMessagesByChannelId);

export default router;
