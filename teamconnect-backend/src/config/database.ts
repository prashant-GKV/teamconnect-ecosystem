import mongoose from "mongoose";
import { logger } from "../shared/logger";
import { env } from "./env";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  if (isConnected) return;

  mongoose.set("strictQuery", true);

  mongoose.connection.on("connected",    () => logger.info("MongoDB connected"));
  mongoose.connection.on("error",        (err) => logger.error({ err }, "MongoDB error"));
  mongoose.connection.on("disconnected", () => { isConnected = false; logger.warn("MongoDB disconnected"); });

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS:          45_000,
    maxPoolSize:              10,
    minPoolSize:              2,
  });

  isConnected = true;
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export { mongoose };
