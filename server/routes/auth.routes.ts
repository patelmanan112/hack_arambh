import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.get("/github", controller.githubLogin);
  router.get("/github/callback", controller.githubCallback);
  router.get("/failure", controller.failure);
  router.post("/logout", controller.logout);
  router.get("/me", requireAuth, controller.getMe);
  router.get("/status", controller.getStatus);

  return router;
}
