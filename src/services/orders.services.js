import ordersRepositorie from "../repositories/orders.repositories.js";
import usersRepositorie from "../repositories/users.repositories.js";
import {
  HTTP_STATUS_CODES,
  USER_ROLES,
  ORDER_STATUS,
} from "../constants/index.js";
import AppError from "../utils/errors.js";

class ordersService {
  async getAllOrders() {
    return ordersRepositorie.getAllOrders();
  }

  async getOrderById(oid) {
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new AppError("Pedido no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }
    return order;
  }

  async createOrder(orderData) {
    const { customer, items, deliveryAddress } = orderData;

    if (!customer) {
      throw new AppError("Falta el cliente", HTTP_STATUS_CODES.BAD_REQUEST);
    }
    if (!items || items.length === 0) {
      throw new AppError(
        "Falta los items del pedido",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!deliveryAddress) {
      throw new AppError("Falta la direccion", HTTP_STATUS_CODES.BAD_REQUEST);
    }

    const total = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const user = await usersRepositorie.getUserById(customer);
    if (!user) {
      throw new AppError("El usuario no existe", HTTP_STATUS_CODES.NOT_FOUND);
    }

    if (user.role === USER_ROLES.DRIVER) {
      throw new AppError(
        "Los repartidores no pueden crear pedidos",
        HTTP_STATUS_CODES.FORBIDDEN,
      );
    }

    const newOrder = await ordersRepositorie.createOrder({
      ...orderData,
      total,
    });

    console.log(
      `[EMAIL SIMULADO] Enviando confirmacion al usuario ${customer}...`,
    );
    console.log(
      `[EMAIL SIMULADO] Tu pedido ${newOrder._id} fue creado. Total: $${total}`,
    );

    const shippingCost = items.reduce((acc, item) => {
      return acc + item.quantity * 10;
    }, 0);

    return {
      order: newOrder,
      shippingCost,
      message: "Pedido creado y email enviado",
    };
  }

  async updateOrderStatus(oid, status) {
    if (!status) {
      throw new AppError(
        "El estado es obligatorio",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new AppError("Pedido no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new AppError(
        "El pedido ya fue entregado",
        HTTP_STATUS_CODES.CONFLICT,
      );
    }

    if (status === ORDER_STATUS.CREATED) {
      throw new AppError(
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
      throw new AppError("Pedido no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }

    await ordersRepositorie.deleteOrder(oid);
    return { message: "Pedido eliminado correctamente" };
  }
}
export default new ordersService();
