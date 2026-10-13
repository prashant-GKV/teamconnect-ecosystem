import * as Minio from "minio";
import { env } from "./env";
import { logger } from "../shared/logger";

export const minioClient = new Minio.Client({
  endPoint:  env.MINIO_ENDPOINT,
  port:      env.MINIO_PORT,
  useSSL:    env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
});

export async function ensureBucketExists(): Promise<void> {
  const exists = await minioClient.bucketExists(env.MINIO_BUCKET);
  if (!exists) {
    await minioClient.makeBucket(env.MINIO_BUCKET, "us-east-1");
    logger.info({ bucket: env.MINIO_BUCKET }, "MinIO bucket created");
  }
}

export async function getSignedUploadUrl(objectName: string): Promise<string> {
  return minioClient.presignedPutObject(env.MINIO_BUCKET, objectName, env.SIGNED_URL_TTL);
}

export async function getSignedDownloadUrl(objectName: string): Promise<string> {
  return minioClient.presignedGetObject(env.MINIO_BUCKET, objectName, env.SIGNED_URL_TTL);
}
