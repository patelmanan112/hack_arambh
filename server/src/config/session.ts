import session from "express-session";
import type { EnvConfig } from "./env.js";

export function createSessionMiddleware(config: EnvConfig) {
  return session({
    name: "recalliq.sid",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: config.isProduction ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: "/",
    },
  });
}
