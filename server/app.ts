import express from "express";
import { loadEnvConfig } from "./config/env.js";
import { createCorsMiddleware } from "./config/cors.js";
import { createSessionMiddleware } from "./config/session.js";
import { AuthController } from "./controllers/auth.controller.js";
import {
  errorHandler,
  notFoundHandler,
} from "./middleware/error.middleware.js";
import { createAuthRoutes } from "./routes/auth.routes.js";
import { initializePassport } from "./services/passport/index.js";
import "./types/session.js";

export function createApp() {
  const config = loadEnvConfig();
  const app = express();
  const passport = initializePassport(config);
  const authController = new AuthController(config);

  app.set("trust proxy", 1);

  app.use(createCorsMiddleware(config));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(createSessionMiddleware(config));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/health", (_req, res) => {
    res.json({ success: true, data: { status: "ok" } });
  });

  app.use("/api/auth", createAuthRoutes(authController));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, config };
}
