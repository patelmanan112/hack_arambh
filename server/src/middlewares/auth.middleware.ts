import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/jwt.js";
import UserModel from "../models/User.model.js";
import type { AuthUser } from "../types/user.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: {
        message: "Authentication required",
        code: "UNAUTHORIZED",
      },
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);

    // Look up user in MongoDB to get full profile + GitHub token
    const dbUser = await UserModel.findOne({ githubId: payload.githubId });

    if (!dbUser) {
      res.status(401).json({
        success: false,
        error: {
          message: "User not found",
          code: "USER_NOT_FOUND",
        },
      });
      return;
    }

    // Attach user and GitHub access token to request
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

    next();
  } catch {
    res.status(401).json({
      success: false,
      error: {
        message: "Invalid or expired token",
        code: "INVALID_TOKEN",
      },
    });
  }
}

export function optionalAuth(
  _req: Request,
  _res: Response,
  next: NextFunction
): void {
  next();
}
