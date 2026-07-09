import { Router } from 'express';
import { RepositoryController } from '../controllers/repository.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const createRepositoryRoutes = (controller: RepositoryController) => {
  const router = Router();

  // POST /api/repository/process — start background ingestion
  router.post('/process', requireAuth, controller.processRepository);

  // GET /api/repository/job/:jobId — poll processing progress
  router.get('/job/:jobId', requireAuth, controller.getJobStatus);

  // GET /api/repository/:repoId/data — fetch all stored knowledge base data
  router.get('/:repoId/data', requireAuth, controller.getRepositoryData);

  return router;
};
