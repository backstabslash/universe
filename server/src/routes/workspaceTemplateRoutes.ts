import { Router } from 'express';
import rateLimiter from '../middleware/rateLimiter';
import workspaceTemplateController from '../controllers/workspaceTemplateController';

const router = Router();

router.get(
    '/get-workspace-templates',
    rateLimiter(),
    workspaceTemplateController.getWorkspaceTemplates
);

router.post(
    '/add-workspace-template',
    rateLimiter(),
    workspaceTemplateController.createWorkspaceTemplateChannels
);

export default router;
