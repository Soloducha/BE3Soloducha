import { ERROR_CODES } from "./error.codes.js";

export const errorDictionary = {
  [ERROR_CODES.VALIDATION_ERROR]: {
    statusCode: 400,
    message: "Los datos enviados no son validos",
  },
  [ERROR_CODES.USER_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro el usuario solicitado",
  },
  [ERROR_CODES.ORDER_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro la orden solicitada",
  },
  [ERROR_CODES.DELIVERY_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro la entrega solicitada",
  },
  [ERROR_CODES.PRODUCT_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro el producto solicitado",
  },
  [ERROR_CODES.INVALID_ORDER_STATUS]: {
    statusCode: 400,
    message: "El estado indicado no es valido para un pedido",
  },
  [ERROR_CODES.INVALID_DELIVERY_STATUS]: {
    statusCode: 400,
    message: "El estado indicado no es valido para una entrega",
  },
  [ERROR_CODES.DRIVER_NOT_AVAILABLE]: {
    statusCode: 409,
    message: "El repartidor no esta disponible",
  },
  [ERROR_CODES.DRIVER_NOT_FOUND]: {
    statusCode: 404,
    message: "No se encontro el repartidor solicitado",
  },
  [ERROR_CODES.FORBIDDEN]: {
    statusCode: 403,
    message: "No tiene permisos para realizar esta accion",
  },
  [ERROR_CODES.CONFLICT]: {
    statusCode: 409,
    message: "Conflicto con el estado actual del recurso",
  },
  [ERROR_CODES.INVALID_MOCK_AMOUNT]: {
    statusCode: 400,
    message: "la cantidad de registros tiene que ser mayor a 0",
  },
  [ERROR_CODES.MOCK_SOURCE_EMPTY]: {
    statusCode: 400,
    message: "No hay datos suficientes para generar los mocks solicitados",
  },
  [ERROR_CODES.ROUTE_NOT_FOUND]: {
    statusCode: 404,
    message: "La ruta solicitada no existe",
  },
  [ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    statusCode: 500,
    message: "Error Interno del Servidor, mala nuestra :(",
  },
};
