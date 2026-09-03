import { Router } from "express";
import productsController from "../controllers/products.controller.js";

const router = Router();

// GET /api/products/all (sin paginación)
router.get("/all", productsController.getAllProducts);
// GET /api/products (paginado)
router.get("", productsController.paginated);
router.get("/:pid", productsController.getProductById);
router.post("", productsController.createProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

export default router;
