import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// GET /api/mocks/users — devuelve datos simulados SIN guardar
router.get("/users", mocksController.generateUsers);

// POST /api/mocks/users — genera e inserta en MongoDB
router.post("/users", mocksController.insertUsers);

// GET /api/mocks/products — devuelve datos simulados SIN guardar
router.get("/products", mocksController.generateProducts);

// POST /api/mocks/products — genera e inserta en MongoDB
router.post("/products", mocksController.insertProducts);

// GET /api/mocks/orders — devuelve datos simulados SIN guardar
router.get("/orders", mocksController.generateOrders);

// POST /api/mocks/orders — genera e inserta en MongoDB
router.post("/orders", mocksController.insertOrders);

// GET /api/mocks/deliveries — devuelve datos simulados SIN guardar
router.get("/deliveries", mocksController.generateDeliveries);

// POST /api/mocks/deliveries — genera e inserta en MongoDB
router.post("/deliveries", mocksController.insertDeliveries);

// GET /api/mocks/logger - genera los diferentes tipos de logs
router.get("/logger", mocksController.generateLogs);

export default router;
