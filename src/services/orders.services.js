import ordersRepositorie from "../repositories/orders.repositories.js";
import usersRepositorie from "../repositories/users.repositories.js";
import { HTTP_STATUS_CODES } from "../constants/index.js";

class ordersService {
  async getAllOrders() {
    return ordersRepositorie.getAllOrders();
  }

  async getOrderById(oid) {
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new Error("Pedido no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }
    return order;
  }

  async createOrder(orderData) {
    const { customer, items, deliveryAddress, priority } = orderData;

    if (!customer) {
      throw new Error("Falta el cliente", HTTP_STATUS_CODES.BAD_REQUEST);
    }
    if (!items || items.length === 0) {
      throw new Error(
        "Falta los items del pedido",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!deliveryAddress) {
      throw new Error("Falta la direccion", HTTP_STATUS_CODES.BAD_REQUEST);
    }

    const total = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const user = await usersRepositorie.getUserById(customer);
    if (!user) {
      throw new Error("El usuario no existe", HTTP_STATUS_CODES.NOT_FOUND);
    }

    if (user.role === USER_ROLES.DRIVER) {
      throw new Error(
        "Los repartidores no pueden crear pedidos",
        HTTP_STATUS_CODES.FORBIDDEN,
      );
    }

    const newOrder = await ordersRepositorie.createOrder(orderData);

    console.log(
      `[EMAIL SIMULADO] Enviando confirmacion al usuario ${customer}...`,
    );
    console.log(
      `[EMAIL SIMULADO] Tu pedido ${newOrder._id} fue creado. Total: $${total}`,
    );

    const shippingCost = newOrder.items.reduce((acc, item) => {
      return acc + item.quantity * 10;
    }, 0);

    res.status(201).json({
      order: newOrder,
      shippingCost,
      message: "Pedido creado y email enviado",
    });
  }

  async updateOrderStatus(oid, status) {
    if (!status) {
      throw new Error(
        "El estado es obligatorio",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new Error("Pedido no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new Error("El pedido ya fue entregado", HTTP_STATUS_CODES.CONFLICT);
    }

    if (
      order.status === ORDER_STATUS.DELIVERED &&
      status === ORDER_STATUS.CREATED
    ) {
      throw new Error(
        "No se puede reiniciar un pedido entregado",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }

    const updatedOrder = await ordersRepositorie.updateOrderStatus(oid, status);

    console.log(`Pedido ${order._id} actualizado a estado: ${status}`);
    return updatedOrder;
  }

  async deleteOrder(oid) {
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new Error("Pedido no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }

    await ordersRepositorie.deleteOrder(oid);
    return { message: "Pedido eliminado correctamente" };
  }
}
export default new ordersService();
