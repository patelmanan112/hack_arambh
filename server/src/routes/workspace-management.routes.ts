import { Router } from 'express';
import { WorkspaceManagementController } from '../controllers/workspace-management.controller.js';

export const createWorkspaceManagementRoutes = (controller: WorkspaceManagementController) => {
  const router = Router();

  // POST /api/workspaces — create a workspace
  router.post('/', controller.createWorkspace);

  // GET /api/workspaces — list user's workspaces
  router.get('/', controller.listWorkspaces);

  return router;
};
