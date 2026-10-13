import Redis from "ioredis";
import { logger } from "../shared/logger";
import { env } from "./env";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: null,
});

redis.on("error", (err: Error) => logger.error({ err }, "Redis client error"));
redis.on("connect", () => logger.info("Redis connected"));
redis.on("ready", () => logger.debug("Redis ready"));

export async function connectRedis(): Promise<void> {
  if (redis.status !== "ready" && redis.status !== "connecting") {
    await redis.connect().catch((err: Error) => logger.error({ err }, "Redis connect failed"));
  }
}
