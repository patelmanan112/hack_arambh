import type { Profile } from "passport";
import type { AuthUser, OAuthProviderName } from "../../types/user.js";

interface GitHubProfileJson {
  email?: string;
  avatar_url?: string;
  html_url?: string;
  name?: string;
}

interface GitHubProfile extends Profile {
  profileUrl?: string;
  _json?: GitHubProfileJson;
}

export interface OAuthProviderDefinition {
  name: OAuthProviderName;
  displayName: string;
  loginPath: string;
  callbackPath: string;
  failurePath: string;
  register: () => void;
}

export interface NormalizedOAuthProfile {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  avatar: string;
  profileUrl: string;
}

export function normalizeGitHubProfile(profile: Profile): NormalizedOAuthProfile {
  const githubProfile = profile as GitHubProfile;
  const email =
    githubProfile.emails?.find((entry) => entry.value)?.value ??
    githubProfile._json?.email ??
    null;

  const username = githubProfile.username ?? githubProfile.displayName ?? "unknown";
  const avatar = githubProfile.photos?.[0]?.value ?? githubProfile._json?.avatar_url ?? "";
  const profileUrl =
    githubProfile.profileUrl ??
    githubProfile._json?.html_url ??
    `https://github.com/${username}`;

  return {
    id: String(githubProfile.id),
    username,
    name: githubProfile.displayName ?? githubProfile._json?.name ?? null,
    email,
    avatar,
    profileUrl,
  };
}

export function toAuthUser(
  provider: OAuthProviderName,
  profile: NormalizedOAuthProfile
): AuthUser {
  return {
    id: profile.id,
    username: profile.username,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    profileUrl: profile.profileUrl,
    provider,
  };
}
