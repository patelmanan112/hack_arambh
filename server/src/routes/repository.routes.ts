import { Router } from 'express';
import { RepositoryController } from '../controllers/repository.controller.js';

export const createRepositoryRoutes = (controller: RepositoryController) => {
  const router = Router();

  // POST /api/repository/process — start background ingestion
  router.post('/process', controller.processRepository);

  // GET /api/repository/job/:jobId — poll processing progress
  router.get('/job/:jobId', controller.getJobStatus);

  // GET /api/repository/:repoId/data — fetch all stored knowledge base data
  router.get('/:repoId/data', controller.getRepositoryData);

  return router;
};
