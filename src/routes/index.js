import { Router } from "express";
import usersRouter from "./users.routes.js";
import ordersRouter from "./orders.routes.js";
import deliveriesRouter from "./deliveries.routes.js";
import productsRouter from "./products.routes.js";


const router= Router();

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/deliveries", deliveriesRouter);
app.use("/products", productsRouter);

export default router;