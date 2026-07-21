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

///viejos routes a reemplazar por controller
// GET /api/deliveries
// router.get("/", async (req, res) => {
//   try {
//     const deliveries = await Delivery.find();
//     res.json(deliveries);
//   } catch (error) {
//     res.status(500).send("Error del servidor");
//   }
// });

// GET /api/deliveries/:did
// router.get("/:did", async (req, res) => {
//   try {
//     const delivery = await Delivery.findById(req.params.did);
//     if (!delivery) {
//       return res.status(404).json({ error: "Entrega no encontrada" });
//     }
//     res.json(delivery);
//   } catch (error) {
//     res.status(500).send("Error del servidor");
//   }
// });

// POST /api/deliveries
// router.post("/", async (req, res) => {
//   try {
//     const { order, driver, priority } = req.body;

//     // if (!order) {
//     //   return res.status(400).send("El pedido es obligatorio");
//     // }
//     // if (!driver) {
//     //   return res.status(400).send("El repartidor es obligatorio");
//     // }

//     const existingOrder = await Order.findById(order);
//     if (!existingOrder) {
//       return res.status(404).json({ error: "El pedido no existe" });
//     }

//     const existingDriver = await User.findById(driver);
//     if (!existingDriver) {
//       return res.status(404).json({ error: "El repartidor no existe" });
//     }

//     if (existingDriver.role !== USER_ROLES.DRIVER) {
//       return res.status(400).json({
//         error: "El usuario no tiene rol de repartidor",
//         role: existingDriver.role,
//       });
//     }

//     if (existingOrder.status !== ORDER_STATUS.CREATED) {
//       return res.status(409).json({
//         error: "El pedido ya fue asignado o procesado",
//         currentStatus: existingOrder.status,
//       });
//     }

//     const newDelivery = await Delivery.create({
//       order,
//       driver,
//       priority: priority || ORDER_PRIORITY.NORMAL,
//       status: DELIVERY_STATUS.ASSIGNED,
//       assignedAt: new Date(),
//     });

//     await Order.findByIdAndUpdate(order, {
//       status: ORDER_STATUS.ASSIGNED,
//       delivery: newDelivery._id,
//     });

//     console.log(`Entrega ${newDelivery._id} creada para el pedido ${order}`);

//     res.status(201).json(newDelivery);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error del servidor");
//   }
// });

// PATCH /api/deliveries/:did/status
router.patch("/:did/status", async (req, res) => {
  try {
    const { status } = req.body;

    // const delivery = await Delivery.findById(req.params.did);

    // if (!delivery) {
    //   return res.status(404).json({ error: "Entrega no encontrada" });
    // }

    if (delivery.status === DELIVERY_STATUS.DELIVERED) {
      return res.status(409).json({
        error: "La entrega ya fue completada",
        currentStatus: delivery.status,
      });
    }

    delivery.status = status;

    if (status === DELIVERY_STATUS.DELIVERED) {
      delivery.deliveredAt = new Date();
      await Order.findByIdAndUpdate(delivery.order, {
        status: ORDER_STATUS.DELIVERED,
      });
    }

    await delivery.save();

    console.log(`Entrega ${delivery._id} actualizada a: ${status}`);

    res.json(delivery);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
});

// DELETE /api/deliveries/:did
router.delete("/:did", async (req, res) => {
  try {
    const delivery = await Delivery.findByIdAndDelete(req.params.did);
    if (!delivery) {
      return res.status(404).json({ error: "Entrega no encontrada" });
    }
    res.json({ message: "Entrega eliminada" });
  } catch (error) {
    res.status(500).send("Error del servidor");
  }
});

export default router;
