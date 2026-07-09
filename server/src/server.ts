import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const serverRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

dotenv.config({ path: path.join(serverRoot, ".env") });
dotenv.config({ path: path.join(serverRoot, "..", ".env.local") });

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";

async function startServer() {
  try {
    const { app, config } = createApp();
    
    // Connect to database
    await connectDB(config);

    app.listen(config.port, () => {
    console.log(`[server] Auth API running on http://localhost:${config.port}`);
    console.log(`[server] GitHub callback URL: ${config.github.callbackUrl}`);
    console.log(`[server] Client URL: ${config.clientUrl}`);

    if (!config.github.clientId.startsWith("gh") && config.github.clientId.includes("your_")) {
      console.warn(
        "[server] WARNING: GITHUB_CLIENT_ID looks like a placeholder. Update server/.env with your GitHub OAuth App credentials."
      );
    }
  });
} catch (error) {
  console.error("[server] Failed to start:");
  console.error(error instanceof Error ? error.message : error);
  console.error(
    "\nSetup: copy server/.env.example to server/.env and add your GitHub OAuth credentials."
  );
  process.exit(1);
}
}

startServer();
