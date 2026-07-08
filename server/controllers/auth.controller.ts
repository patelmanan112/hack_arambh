import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import type { EnvConfig } from "../config/env.js";
import { getGitHubStrategyName } from "../services/passport/providers/github.provider.js";
import type { AuthUser } from "../types/user.js";

export class AuthController {
  constructor(private readonly config: EnvConfig) {}

  githubLogin = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate(getGitHubStrategyName(), {
      scope: ["user:email"],
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
      session: true,
    })(req, res, (err: unknown) => {
      if (err) {
        next(err);
        return;
      }

      res.redirect(`${this.config.clientUrl}/dashboard?auth=success`);
    });
  };

  failure = (_req: Request, res: Response): void => {
    res.redirect(`${this.config.clientUrl}/login?error=auth_failed`);
  };

  logout = (req: Request, res: Response, next: NextFunction): void => {
    req.logout((err) => {
      if (err) {
        next(err);
        return;
      }

      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          next(destroyErr);
          return;
        }

        res.clearCookie("recalliq.sid", {
          httpOnly: true,
          secure: this.config.isProduction,
          sameSite: this.config.isProduction ? "none" : "lax",
          path: "/",
        });

        res.json({
          success: true,
          data: { message: "Logged out successfully" },
        });
      });
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
