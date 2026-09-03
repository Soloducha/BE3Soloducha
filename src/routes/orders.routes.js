import { Router } from "express";
import ordersController from "../controllers/orders.controller.js";

const router = Router();
// GET /api/orders/all (sin paginación)
router.get("/all", ordersController.getAllOrders);
// GET /api/orders (paginado)
router.get("", ordersController.paginated);
// GET /api/orders/:oid
router.get("/:oid", ordersController.getOrderById);
// POST /api/orders
router.post("", ordersController.createOrder);
// PATCH /api/orders/:oid/status
router.patch("/:oid/status", ordersController.updateOrderStatus);
// DELETE /api/orders/:oid
router.delete("/:oid", ordersController.deleteOrder);

export default router;
