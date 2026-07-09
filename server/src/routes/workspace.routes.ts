import { Router } from 'express';
import { WorkspaceController } from '../controllers/workspace.controller.js';

export const createWorkspaceRoutes = (controller: WorkspaceController) => {
  const router = Router();
  
  router.get('/:id/overview', controller.getOverview);

  return router;
};
