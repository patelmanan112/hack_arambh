export interface EnvConfig {
  nodeEnv: string;
  port: number;
  clientUrl: string;
  sessionSecret: string;
  github: {
    clientId: string;
    clientSecret: string;
    callbackUrl: string;
  };
  isProduction: boolean;
  mongodbUri: string;
}

function requireEnv(key: string, devDefault?: string): string {
  const value = process.env[key] ?? devDefault;
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Copy server/.env.example to server/.env and set your values.`
    );
  }
  return value;
}

export function loadEnvConfig(): EnvConfig {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const isProduction = nodeEnv === "production";

  if (!isProduction && !process.env.SESSION_SECRET) {
    console.warn(
      "[server] Using default SESSION_SECRET for development. Set SESSION_SECRET in server/.env for production."
    );
  }

  const clientUrl = requireEnv(
    "CLIENT_URL",
    isProduction ? undefined : "http://localhost:3000"
  ).replace(/\/$/, "");

  const port = Number(process.env.PORT ?? "4000");

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("PORT must be a positive number");
  }

  const callbackUrl =
    process.env.GITHUB_CALLBACK_URL ??
    `${clientUrl}/api/auth/github/callback`;

  return {
    nodeEnv,
    port,
    clientUrl,
    sessionSecret: requireEnv(
      "SESSION_SECRET",
      isProduction ? undefined : "dev-session-secret-do-not-use-in-production"
    ),
    github: {
      clientId: requireEnv("GITHUB_CLIENT_ID"),
      clientSecret: requireEnv("GITHUB_CLIENT_SECRET"),
      callbackUrl,
    },
    isProduction,
    mongodbUri: requireEnv("MONGODB_URI", "mongodb://localhost:27017/recall_iq"),
  };
}
