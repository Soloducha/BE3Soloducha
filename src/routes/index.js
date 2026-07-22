import { Router } from "express";
import usersRouter from "./users.routes.js";
import ordersRouter from "./orders.routes.js";
import deliveriesRouter from "./deliveries.routes.js";
import productsRouter from "./products.routes.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/orders", ordersRouter);
router.use("/deliveries", deliveriesRouter);
router.use("/products", productsRouter);

export default router;
