import { Router } from "express";
import type { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { optionalJwtAuth } from "../middlewares/optional-jwt.middleware.js";

export function createAuthRoutes(controller: AuthController): Router {
  const router = Router();

  router.get("/github", controller.githubLogin);
  router.get("/github/callback", controller.githubCallback);
  router.get("/failure", controller.failure);
  router.post("/logout", controller.logout);
  router.get("/me", requireAuth, controller.getMe);
  router.get("/status", optionalJwtAuth, controller.getStatus);

  return router;
}
