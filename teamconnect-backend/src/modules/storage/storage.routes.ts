import { Router } from "express";
import { ok, created } from "../../shared/response";

export const storageRouter = Router();

// POST /api/v1/storage/upload
storageRouter.post("/upload", (req, res) => {
  const fileId = `file-${Date.now()}`;
  return created(res, {
    fileId,
    objectName: `uploads/${fileId}.pdf`,
    originalName: req.body.originalName || "document.pdf",
    mimeType: req.body.mimeType || "application/pdf",
    sizeBytes: req.body.sizeBytes || 1048576,
    uploadedAt: new Date().toISOString(),
  });
});

// GET /api/v1/storage/:fileId/url
storageRouter.get("/:fileId/url", (req, res) => {
  return ok(res, {
    fileId: req.params.fileId,
    url: `https://storage.teamconnect.internal/download/${req.params.fileId}?token=mock-token`,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
  });
});
