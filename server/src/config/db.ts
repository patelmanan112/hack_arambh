import mongoose from "mongoose";
import { EnvConfig } from "./env.js";

export const connectDB = async (config: EnvConfig) => {
  try {
    const conn = await mongoose.connect(config.mongodbUri);
    console.log(`[server] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[server] Error connecting to MongoDB: ${(error as Error).message}`);
    process.exit(1);
  }
};
