import { Router } from "express";
import upload, { handleUploadError } from "../middleware/uploadMiddleware.js";
import usersController from "../controllers/users.controller.js";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";

const ALLOWED_DOC_TYPES = ["document", "license", "proof"];

const router = Router();

router.post(
  "/:uid/documents",
  upload.single("document"),
  handleUploadError,
  (req, res, next) => {
    const { type } = req.body;
    if (!type || !ALLOWED_DOC_TYPES.includes(type)) {
      return next(
        new AppError(
          ERROR_CODES.INVALID_DOCUMENT_TYPE,
          `Tipo de documento inválido. Tipos permitidos: ${ALLOWED_DOC_TYPES.join(", ")}`,
        ),
      );
    }
    next();
  },
  usersController.uploadUserDocument,
);

export default router;
