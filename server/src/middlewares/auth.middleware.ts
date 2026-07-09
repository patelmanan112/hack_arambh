import type { NextFunction, Request, Response } from "express";
import type { AuthUser } from "../types/user.js";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const user = req.user as AuthUser | undefined;

  if (!user) {
    console.warn("[auth] requireAuth failed: req.user is undefined. Received cookies:", req.headers.cookie);
    res.status(401).json({
      success: false,
      error: {
        message: "Authentication required",
        code: "UNAUTHORIZED",
      },
    });
    return;
  }

  next();
}

export function optionalAuth(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  next();
}
