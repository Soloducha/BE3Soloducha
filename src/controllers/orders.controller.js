import ordersService from "../services/orders.services.js";
import { HTTP_STATUS, HTTP_STATUS_CODES } from "../constants/index.js";

// router.get("", ordersController.getAllOrders);
// router.get("/:oid", ordersController.getOrderById);
// router.post("", ordersController.createOrder);
// router.patch("/:oid/status", ordersController.updateOrderStatus);
// router.delete("/:oid", ordersController.deleteOrder);

class ordersController {
  async getAllOrders(req, res, next) {
    try {
      const orders = await ordersService.getAllOrders();
      res.json({ status: HTTP_STATUS.SUCCESS, payload: orders });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const order = await ordersService.getOrderById(req.params.oid);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: order });
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req, res, next) {
    try {
      const newOrder = await ordersService.createOrder(req.body);
      res.status(201).json({ status: HTTP_STATUS.SUCCESS, payload: newOrder });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {
    try {
      const { oid } = req.params;
      const { status } = req.body;
      const updatedOrder = await ordersService.updateOrderStatus(oid, status);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: updatedOrder });
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req, res, next) {
    try {
      const deletedOrder = await ordersService.deleteOrder(req.params.oid);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: deletedOrder });
    } catch (error) {
      next(error);
    }
  }
}

export default new ordersController();
