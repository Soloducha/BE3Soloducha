import { Router } from "express";
import deliveriesController from "../controllers/deliveries.controller.js";

const router = Router();

// GET /api/deliveries/all (sin paginación)
router.get("/all", deliveriesController.getAllDeliveries);
// GET /api/deliveries (paginado)
router.get("", deliveriesController.paginated);
// GET /api/deliveries/:did
router.get("/:did", deliveriesController.getDeliveryById);
// POST /api/deliveries
router.post("", deliveriesController.createDelivery);
// PATCH /api/deliveries/:did/status
router.patch("/:did/status", deliveriesController.updateDeliveryStatus);
// DELETE /api/deliveries/:did
router.delete("/:did", deliveriesController.deleteDelivery);

export default router;
