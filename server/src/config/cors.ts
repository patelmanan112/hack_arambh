import cors from "cors";
import type { EnvConfig } from "./env.js";

export function createCorsMiddleware(config: EnvConfig) {
  return cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });
}
