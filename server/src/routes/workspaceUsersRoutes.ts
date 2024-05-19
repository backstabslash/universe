import { Router } from 'express';
import rateLimiter from '../middleware/rateLimiter';
import workSpaceController from '../controllers/workSpaceController';

const router = Router();

router.get(
  '/get-workspace-users',
  rateLimiter(),
  workSpaceController.getWorkspaceUsers
);

export default router;
