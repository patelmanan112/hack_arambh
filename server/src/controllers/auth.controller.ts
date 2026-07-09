import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { EnvConfig } from "../config/env.js";
import { signToken } from "../config/jwt.js";
import { getGitHubStrategyName } from "../services/passport/providers/github.provider.js";
import type { AuthUser } from "../types/user.js";

export class AuthController {
  constructor(private readonly config: EnvConfig) {}

  githubLogin = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(getGitHubStrategyName(), {
      scope: ["user:email", "repo"],
      session: false,
    })(req, res, (err: unknown) => {
      if (err) {
        console.error("[auth] GitHub login error:", err);
        next(err);
        return;
      }

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: {
            message:
              "Failed to start GitHub authentication. Check GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in server/.env.",
            code: "OAUTH_INIT_FAILED",
          },
        });
      }
    });
  };

  githubCallback = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(getGitHubStrategyName(), {
      failureRedirect: `${this.config.clientUrl}/login?error=auth_failed`,
      session: false,
    })(req, res, (err: unknown) => {
      if (err) {
        console.error("[auth] GitHub callback error:", err);
        next(err);
        return;
      }

      const user = req.user as (AuthUser & { _id?: string }) | undefined;

      if (!user) {
        res.redirect(`${this.config.clientUrl}/login?error=auth_failed`);
        return;
      }

      // Sign a JWT with user info
      const token = signToken({
        userId: user._id ?? user.id,
        githubId: user.id,
        username: user.username,
        provider: user.provider,
      });

      // Redirect to client with the JWT token in the URL
      res.redirect(
        `${this.config.clientUrl}/onboarding/select-repositories?token=${token}`
      );
    });
  };

  failure = (_req: Request, res: Response): void => {
    res.redirect(`${this.config.clientUrl}/login?error=auth_failed`);
  };

  logout = (_req: Request, res: Response): void => {
    // With JWT, logout is client-side (delete the token).
    // This endpoint exists for API completeness.
    res.json({
      success: true,
      data: { message: "Logged out successfully" },
    });
  };

  getMe = (req: Request, res: Response): void => {
    const user = req.user as AuthUser | undefined;

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          message: "Not authenticated",
          code: "UNAUTHORIZED",
        },
      });
      return;
    }

    res.json({
      success: true,
      data: { user },
    });
  };

  getStatus = (req: Request, res: Response): void => {
    const user = req.user as AuthUser | undefined;

    res.json({
      success: true,
      data: {
        authenticated: Boolean(user),
        user: user ?? null,
      },
    });
  };
}
