import passport from "passport";
import type { OAuthProviderDefinition } from "./types.js";

class OAuthProviderRegistry {
  private providers = new Map<string, OAuthProviderDefinition>();

  register(provider: OAuthProviderDefinition): void {
    if (this.providers.has(provider.name)) {
      throw new Error(`OAuth provider "${provider.name}" is already registered`);
    }

    provider.register();
    this.providers.set(provider.name, provider);
  }

  getProvider(name: string): OAuthProviderDefinition | undefined {
    return this.providers.get(name);
  }

  getAllProviders(): OAuthProviderDefinition[] {
    return Array.from(this.providers.values());
  }
}

export const oauthProviderRegistry = new OAuthProviderRegistry();

export { passport };
