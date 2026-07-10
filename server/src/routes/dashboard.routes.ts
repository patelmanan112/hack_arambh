import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const createDashboardRoutes = (controller: DashboardController) => {
  const router = Router();

  // All dashboard routes require JWT auth
  router.use(requireAuth);

  // GET /api/dashboard/workspace/:id
  router.get('/workspace/:id', controller.getWorkspaceDashboard);

  return router;
};
