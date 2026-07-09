import type { EnvConfig } from "../../config/env.js";
import { createGitHubProvider } from "./providers/github.provider.js";
import {
  configurePassportSerialization,
  oauthProviderRegistry,
  passport,
} from "./registry.js";

export function initializePassport(config: EnvConfig): typeof passport {
  configurePassportSerialization();
  oauthProviderRegistry.register(createGitHubProvider(config));

  // Future providers — uncomment and implement when ready:
  // oauthProviderRegistry.register(createGoogleProvider(config));
  // oauthProviderRegistry.register(createJiraProvider(config));
  // oauthProviderRegistry.register(createSlackProvider(config));
  // oauthProviderRegistry.register(createMicrosoftProvider(config));
  // oauthProviderRegistry.register(createDiscordProvider(config));
  // oauthProviderRegistry.register(createSpotifyProvider(config));

  return passport;
}

export { oauthProviderRegistry, passport };
