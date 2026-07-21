import { Router } from "express";
import Delivery from "../models/delivery.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import deliveriesController from "../controllers/deliveries.controller.js";

import {
  USER_ROLES,
  ORDER_STATUS,
  DELIVERY_STATUS,
  ORDER_PRIORITY,
} from "../constants/index.js";

const router = Router();

// GET /api/deliveries
router.get("", deliveriesController.getAllDeliveries);
// GET /api/deliveries/:did
router.get("/:did", deliveriesController.getDeliveryById);
// POST /api/deliveries
router.post("", deliveriesController.createDelivery);
// PATCH /api/deliveries/:did/status
router.patch("/:did/status", deliveriesController.updateDeliveryStatus);
// DELETE /api/deliveries/:did
router.delete("/:did", deliveriesController.deleteDelivery);

export default router;
