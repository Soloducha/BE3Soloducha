import config from "../config/index.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export const notFoundHandler = (req, res, next) => {
  const error = new AppError(
    ERROR_CODES.ROUTE_NOT_FOUND,
    "La ruta solicitada no existe",
  );
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const errorCode = error.code || ERROR_CODES.INTERNAL_SERVER_ERROR;

  if (statusCode >= 500) {
    logger.error(error.message, { stack: error.stack });
  } else {
    logger.warn(error.message);
  }

  const response = {
    status: statusCode >= 400 && statusCode < 500 ? "fail" : "error",
    error: errorCode,
    message: error.message || "Ocurrió un error interno del servidor",
  };

  if (config.nodeEnv === "development" && error.details) {
    response.details = error.details;
  }

  res.status(statusCode).json(response);
};
