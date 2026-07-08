/**
 * Template for adding a new OAuth provider.
 *
 * Steps to add a provider (e.g. Google):
 * 1. Copy this file to `providers/google.provider.ts`
 * 2. Install the Passport strategy package (e.g. `passport-google-oauth20`)
 * 3. Implement `createGoogleProvider()` following the GitHub example
 * 4. Register it in `services/passport/index.ts`
 * 5. Add routes in `routes/auth.routes.ts` (or use a dynamic provider router)
 * 6. Add a login button on the frontend
 */

import type { EnvConfig } from "../../../config/env.js";
import type { OAuthProviderDefinition } from "../types.js";

export function createExampleProvider(_config: EnvConfig): OAuthProviderDefinition {
  return {
    name: "google",
    displayName: "Google",
    loginPath: "/google",
    callbackPath: "/google/callback",
    failurePath: "/failure",
    register: () => {
      // passport.use("google", new GoogleStrategy({ ... }, verifyCallback));
    },
  };
}
