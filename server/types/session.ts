import type { AuthUser } from "./user.js";

declare module "express-session" {
  interface SessionData {
    user?: AuthUser;
  }
}

export {};
