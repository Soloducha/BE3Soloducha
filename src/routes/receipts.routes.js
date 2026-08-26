import { Router } from "express";
import upload, { handleUploadError } from "../middleware/uploadMiddleware.js";
import receiptsController from "../controllers/receipts.controller.js";

const router = Router();

router.post(
  "/:entityType/:entityId",
  upload.single("proof"),
  handleUploadError,
  receiptsController.uploadReceipt,
);

export default router;
