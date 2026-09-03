import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";
import { productionGate } from "../middleware/productionGate.js";

const router = Router();

// Todos los endpoints de mocks y logger están bloqueados en producción
router.use(productionGate);

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
