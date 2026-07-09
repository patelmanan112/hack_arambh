import { Router } from 'express';
import { WorkspaceManagementController } from '../controllers/workspace-management.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const createWorkspaceManagementRoutes = (controller: WorkspaceManagementController) => {
  const router = Router();

  // All workspace management routes require JWT auth
  router.use(requireAuth);

  // POST /api/workspaces — create a workspace
  router.post('/', controller.createWorkspace);

  // GET /api/workspaces — list user's workspaces
  router.get('/', controller.listWorkspaces);

  return router;
};
