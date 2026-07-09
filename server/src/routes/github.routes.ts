import { Router } from "express";
import type { GitHubController } from "../controllers/github.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

export function createGitHubRoutes(controller: GitHubController): Router {
  const router = Router();

  // All GitHub routes require authentication
  router.use(requireAuth);

  router.get("/repos", controller.getRepos);
  router.post("/select-repositories", controller.selectRepositories);
  router.get("/selected-repositories", controller.getSelectedRepositories);

  return router;
}
