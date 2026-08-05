import { ERROR_CODES } from "../constants/error.codes.js";
import { errorDictionary } from "../constants/error.dictionary.js";

export class AppError extends Error {
  constructor(
    code = ERROR_CODES.INTERNAL_SERVER_ERROR,
    customMessage,
    details,
  ) {
    const errorDefinition =
      errorDictionary[code] ||
      errorDictionary[ERROR_CODES.INTERNAL_SERVER_ERROR];

    super(customMessage || errorDefinition.message);
    this.code = code;
    this.statusCode = errorDefinition.statusCode;
    this.details = details;
    this.isOperational = true;
  }
}
