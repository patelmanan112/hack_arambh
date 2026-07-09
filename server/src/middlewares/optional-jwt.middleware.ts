import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt.js";
import UserModel from "../models/User.model.js";
import type { AuthUser } from "../types/user.js";

/**
 * Optional JWT middleware — if a valid Bearer token is provided, attaches
 * `req.user` and `req.githubAccessToken`. If no token or invalid token,
 * silently continues without setting req.user.
 */
export async function optionalJwtAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    const dbUser = await UserModel.findOne({ githubId: payload.githubId });

    if (dbUser) {
      req.user = {
        id: dbUser.githubId,
        username: dbUser.username,
        name: dbUser.name ?? null,
        email: dbUser.email ?? null,
        avatar: dbUser.avatar,
        profileUrl: dbUser.profileUrl,
        provider: dbUser.provider,
      } as AuthUser;

      req.githubAccessToken = dbUser.githubAccessToken;
    }
  } catch {
    // Invalid token — just continue without user
  }

  next();
}
