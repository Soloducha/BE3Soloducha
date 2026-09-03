import ordersRepositorie from "../repositories/orders.repositories.js";
import usersRepositorie from "../repositories/users.repositories.js";
import { USER_ROLES, ORDER_STATUS } from "../constants/index.js";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { logger } from "../utils/logger.js";

class ordersService {
  async getAllOrders() {
    return ordersRepositorie.getAllOrders();
  }

  async paginated({ page = 1, limit = 10 }) {
    const currentPage = Number(page);
    const currentLimit = Number(limit);
    const result = await ordersRepositorie.paginated({
      page: currentPage,
      limit: currentLimit,
    });
    const totalDocuments = await ordersRepositorie.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      docs: result,
      count: result.length,
      total: totalDocuments,
      totalPages,
      page: currentPage,
      hasPreviousPage: currentPage > 1,
      hasNextPages: currentPage < totalPages,
      prevLink:
        currentPage > 1
          ? `/api/orders?page=${currentPage - 1}&limit=${currentLimit}`
          : null,
      nextLink:
        currentPage < totalPages
          ? `/api/orders?page=${currentPage + 1}&limit=${currentLimit}`
          : null,
    };
  }

  async getOrderById(oid) {
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND, "Pedido no encontrado");
    }
    return order;
  }

  async createOrder(orderData) {
    const { customer, items, deliveryAddress } = orderData;

    if (!customer) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Falta el cliente");
    }
    if (!items || items.length === 0) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Falta los items del pedido",
      );
    }
    if (!deliveryAddress) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Falta la direccion");
    }

    const total = items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const user = await usersRepositorie.getUserById(customer);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, "Usuario no encontrado");
    }

    if (user.role === USER_ROLES.DRIVER) {
      throw new AppError(
        ERROR_CODES.FORBIDDEN,
        "Los repartidores no pueden crear pedidos",
      );
    }

    const newOrder = await ordersRepositorie.createOrder({
      ...orderData,
      total,
    });

    logger.info(
      `[EMAIL SIMULADO] Enviando confirmacion al usuario ${customer}...`,
    );
    logger.info(
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
        ERROR_CODES.VALIDATION_ERROR,
        "El estado es obligatorio",
      );
    }
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND, "Pedido no encontrado");
    }

    if (order.status === ORDER_STATUS.DELIVERED) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "El pedido ya fue entregado",
      );
    }

    if (status === ORDER_STATUS.CREATED) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "No se puede reiniciar un pedido entregado",
      );
    }

    const updatedOrder = await ordersRepositorie.updateOrderStatus(oid, status);
    if (!updatedOrder) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND, "Pedido no encontrado");
    }

    logger.info(`Pedido ${order._id} actualizado a estado: ${status}`);
    return updatedOrder;
  }

  async deleteOrder(oid) {
    const order = await ordersRepositorie.getOrderById(oid);
    if (!order) {
      throw new AppError(ERROR_CODES.ORDER_NOT_FOUND, "Pedido no encontrado");
    }

    await ordersRepositorie.deleteOrder(oid);
    return { message: "Pedido eliminado correctamente" };
  }
}
export default new ordersService();
