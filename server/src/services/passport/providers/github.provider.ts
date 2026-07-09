import { Strategy as GitHubStrategy, type Profile as GitHubStrategyProfile } from "passport-github2";
import type { EnvConfig } from "../../../config/env.js";
import { passport } from "../registry.js";
import {
  normalizeGitHubProfile,
  toAuthUser,
  type OAuthProviderDefinition,
} from "../types.js";

export function createGitHubProvider(config: EnvConfig): OAuthProviderDefinition {
  const strategyName = "github";

  return {
    name: "github",
    displayName: "GitHub",
    loginPath: "/github",
    callbackPath: "/github/callback",
    failurePath: "/failure",
    register: () => {
      passport.use(
        strategyName,
        new GitHubStrategy(
          {
            clientID: config.github.clientId,
            clientSecret: config.github.clientSecret,
            callbackURL: config.github.callbackUrl,
            scope: ["user:email", "repo"],
            passReqToCallback: true as const,
          },
          (
            req: Express.Request,
            accessToken: string,
            _refreshToken: string,
            profile: GitHubStrategyProfile,
            done: (error: Error | null, user?: Express.User) => void
          ) => {
            try {
              const normalized = normalizeGitHubProfile(profile);
              const user = toAuthUser("github", normalized);
              // Store access token in session for GitHub API calls
              (req as Express.Request & { session: { githubAccessToken?: string } }).session.githubAccessToken = accessToken;
              done(null, user);
            } catch (error) {
              done(error as Error);
            }
          }
        )
      );
    },
  };
}

export function getGitHubStrategyName(): string {
  return "github";
}
