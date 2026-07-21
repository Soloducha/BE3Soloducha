export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  CUSTOMER: "customer",
  DRIVER: "driver",
  STORE: "store",
});

export const DELIVERY_STATUS = Object.freeze({
  PENDING: "pending",
  ASSIGNED: "assigned",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

export const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  ASSIGNED: "assigned",
  CREATED: "created",
});

export const ORDER_PRIORITY = Object.freeze({
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
});

export const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
});

export const HTTP_STATUS = Object.freeze({
  SUCCESS: "success",
  ERROR: "error",
});

export const HTTP_STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
});
