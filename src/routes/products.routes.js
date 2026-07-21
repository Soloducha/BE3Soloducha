import { Router } from "express";
import Product from "../models/product.model.js";
import productsController from "../controllers/products.controller.js";

const router = Router();

router.get("", productsController.getAllProducts);
router.get("/:pid", productsController.getProductById);
router.post("", productsController.createProduct);
router.put("/:pid", productsController.updateProduct);
router.delete("/:pid", productsController.deleteProduct);

export default router;
