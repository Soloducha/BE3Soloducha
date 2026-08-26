import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";

const UPLOADS_DIR = "uploads";

const allowedMimeTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body?.type || "documents";
    const dir = path.join(UPLOADS_DIR, type);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        ERROR_CODES.UNSUPPORTED_MEDIA_TYPE,
        "Tipo de archivo no permitido",
      ),
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new AppError(
          ERROR_CODES.FILE_TOO_LARGE,
          "El archivo supera el tamaño máximo de 5MB",
        ),
      );
    }
    return next(err);
  }
  next(err);
};

export default upload;
export { handleUploadError };
