import { Router } from "express";
import mocksController from "../controllers/mocks.controller.js";

const router = Router();

// GET /api/mocks/users — devuelve datos simulados SIN guardar
router.get("/users", mocksController.generateUsers);

// POST /api/mocks/users — genera e inserta en MongoDB
router.post("/users", mocksController.insertUsers);

export default router;
