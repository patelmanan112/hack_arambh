import { Strategy as GitHubStrategy, type Profile as GitHubStrategyProfile } from "passport-github2";
import type { EnvConfig } from "../../../config/env.js";
import { passport } from "../registry.js";
import {
  normalizeGitHubProfile,
  toAuthUser,
  type OAuthProviderDefinition,
} from "../types.js";
import UserModel from "../../../models/User.model.js";

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
          async (
            req: Express.Request,
            accessToken: string,
            _refreshToken: string,
            profile: GitHubStrategyProfile,
            done: (error: Error | null, user?: Express.User) => void
          ) => {
            try {
              const normalized = normalizeGitHubProfile(profile);
              const user = toAuthUser("github", normalized);
              
              // Store user credentials and token inside MongoDB
              await UserModel.findOneAndUpdate(
                { githubId: user.id },
                {
                  githubId: user.id,
                  username: user.username,
                  name: user.name ?? undefined,
                  email: user.email ?? undefined,
                  avatar: user.avatar,
                  profileUrl: user.profileUrl,
                  provider: user.provider,
                  githubUsername: user.username,
                  githubAvatar: user.avatar,
                  githubAccessToken: accessToken,
                },
                { upsert: true, new: true }
              );

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
