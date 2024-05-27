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
router.post(
  '/update-workspace-avatar',
  rateLimiter(),
  workSpaceController.updateWorkspaceAvatar
);
router.get(
  '/get-workspace-channels',
  rateLimiter(),
  workSpaceController.getWorkspaceChannels
);

router.post(
  '/add-workspace-role',
  rateLimiter(),
  workSpaceController.addWorkSpaceRoles
);

router.post(
  '/get-workspace-roles',
  rateLimiter(),
  workSpaceController.getWorkSpaceRoles
);

export default router;
