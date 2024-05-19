import { Router } from 'express';
import rateLimiter from '../middleware/rateLimiter';
import workSpaceController from '../controllers/workSpaceController';

const router = Router();

router.get(
  '/get-workspace-users',
  rateLimiter(),
  workSpaceController.getWorkspaceUsers
);
router.get(
  '/get-workspace-data',
  rateLimiter(),
  workSpaceController.getWorkspaceData
);
router.post('/update-workspace-avatar', rateLimiter(), workSpaceController.updateWorkspaceAvatar);

export default router;
