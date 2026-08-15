import config from "../config/index.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { errorDictionary } from "../constants/error.dictionary.js";
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
  // Los ValidationError de mongoose (datos que no cumplen el schema) son
  // errores del cliente: se mapean a 400 con el contrato de la API.
  if (error.name === "ValidationError") {
    error.statusCode = 400;
    error.code = ERROR_CODES.VALIDATION_ERROR;
    if (config.nodeEnv === "development") {
      error.details = Object.fromEntries(
        Object.entries(error.errors || {}).map(([field, validationError]) => [
          field,
          validationError.message,
        ]),
      );
    }
    error.message = errorDictionary[ERROR_CODES.VALIDATION_ERROR].message;
  }

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
