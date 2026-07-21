import { Router } from "express";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import ordersController from "../controllers/orders.controller.js";

import {
  USER_ROLES,
  ORDER_STATUS,
  ORDER_PRIORITY,
} from "../constants/index.js";

const router = Router();
// GET /api/orders
router.get("", ordersController.getAllOrders);
// GET /api/orders/:oid
router.get("/:oid", ordersController.getOrderById);
// POST /api/orders
router.post("", ordersController.createOrder);
// PATCH /api/orders/:oid/status
router.patch("/:oid/status", ordersController.updateOrderStatus);
// DELETE /api/orders/:oid
router.delete("/:oid", ordersController.deleteOrder);

export default router;
