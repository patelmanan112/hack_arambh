import mongoose from "mongoose";
import { EnvConfig } from "./env.js";

export const connectDB = async (config: EnvConfig) => {
  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: config.isProduction ? 10000 : 15000,
    });
    console.log(`[server] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[server] Error connecting to MongoDB: ${message}`);

    if (config.isProduction || process.env.ALLOW_START_WITHOUT_DB === "true") {
      console.error(
        "[server] Continuing startup without MongoDB. Database-backed features will be unavailable until MONGODB_URI is reachable."
      );
      return false;
    }

    console.error(
      "[server] Set MONGODB_URI to a reachable MongoDB Atlas or instance connection string, or set ALLOW_START_WITHOUT_DB=true to continue without a database."
    );
    process.exit(1);
  }
};
