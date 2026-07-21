import Order from "../models/order.model.js";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";

class ordersRepositorie {
  async getAllOrders() {
    return Order.find();
  }

  async getOrderById(oid) {
    return Order.findById(oid);
  }

  async createOrder(orderData) {
    return Order.create({
      customer: orderData.customer,
      items: orderData.items,
      deliveryAddress: orderData.deliveryAddress,
      total: orderData.total,
      priority: orderData.priority || ORDER_PRIORITY.NORMAL,
      status: ORDER_STATUS.CREATED,
    });
  }

  async updateOrderStatus(oid, status) {
    const order = await Order.findByIdAndUpdate(
      oid,
      { status },
      { new: true, runValidators: true },
    );

    if (!order) {
      throw new Error("Pedido no encontrado");
    }

    return order;
  }

  async deleteOrder(oid) {
    const deletedOrder = await Order.findByIdAndDelete(oid);

    if (!deletedOrder) {
      throw new Error("Pedido no encontrado");
    }

    return deletedOrder;
  }
}

export default new ordersRepositorie();
