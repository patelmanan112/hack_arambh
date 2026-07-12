import express from "express";
import { loadEnvConfig } from "./config/env.js";
import { createCorsMiddleware } from "./config/cors.js";
import { initJwt } from "./config/jwt.js";
import { AuthController } from "./controllers/auth.controller.js";
import { GitHubController } from "./controllers/github.controller.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middlewares/error.middleware.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { createGitHubRoutes } from "./routes/github.routes.js";
import { createRepositoryRoutes } from "./routes/repository.routes.js";
import { createWorkspaceRoutes } from "./routes/workspace.routes.js";
import { createWorkspaceManagementRoutes } from "./routes/workspace-management.routes.js";
import { createDashboardRoutes } from "./routes/dashboard.routes.js";
import { RepositoryController } from "./controllers/repository.controller.js";
import { WorkspaceController } from "./controllers/workspace.controller.js";
import { WorkspaceManagementController } from "./controllers/workspace-management.controller.js";
import { DashboardController } from "./controllers/dashboard.controller.js";
import copilotRoutes from "./routes/copilot.routes.js";
import { initializePassport } from "./services/passport/index.js";

export function createApp() {
  const config = loadEnvConfig();
  const app = express();

  // Initialize JWT signing/verification
  initJwt(config);

  // Initialize Passport (strategy registration only — no session serialization)
  const passport = initializePassport(config);

  const authController = new AuthController(config);
  const gitHubController = new GitHubController();
  const repositoryController = new RepositoryController();
  const workspaceController = new WorkspaceController();
  const workspaceManagementController = new WorkspaceManagementController();
  const dashboardController = new DashboardController();

  app.set("trust proxy", 1);

  app.use(createCorsMiddleware(config));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/auth", createAuthRoutes(authController));
  app.use("/api/github", createGitHubRoutes(gitHubController));
  app.use("/api/repository", createRepositoryRoutes(repositoryController));
  app.use("/api/workspace", createWorkspaceRoutes(workspaceController));
  app.use("/api/workspaces", createWorkspaceManagementRoutes(workspaceManagementController));
  app.use("/api/dashboard", createDashboardRoutes(dashboardController));
  app.use("/api/copilot", copilotRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, config };
}
