import usersRepositorie from "../repositories/users.repositories.js";
import ordersServices from "./orders.services.js";
import deliveriesRepositorie from "../repositories/deliveries.repositories.js";
import AppError from "../utils/errors.js";
import {
  USER_ROLES,
  HTTP_STATUS_CODES,
  DELIVERY_STATUS,
  ORDER_STATUS,
  ORDER_PRIORITY,
} from "../constants/index.js";

class deliveriesService {
  async getAllDeliveries() {
    return deliveriesRepositorie.getAllDeliveries();
  }

  async getDeliveryById(did) {
    const delivery = await deliveriesRepositorie.getDeliveryById(did);
    if (!delivery) {
      throw new AppError("Entrega no encontrada", HTTP_STATUS_CODES.NOT_FOUND);
    }
    return delivery;
  }

  async createDelivery(deliveryData) {
    const { order, driver, priority } = deliveryData;
    if (!order) {
      throw new AppError(
        "El pedido es obligatorio",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }
    if (!driver) {
      throw new AppError(
        "El repartidor es obligatorio",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }

    const existingOrder = await ordersServices.getOrderById(order);
    if (!existingOrder) {
      throw new AppError("El pedido no existe", HTTP_STATUS_CODES.NOT_FOUND);
    }

    //llamo al repositorio y no al servicio para que no me devuelva "Usuario no encontrado", sino "Repartidor no econtrado"
    const existingDriver = await usersRepositorie.getUserById(driver);
    if (!existingDriver) {
      throw new AppError(
        "El repartidor no existe",
        HTTP_STATUS_CODES.NOT_FOUND,
      );
    }

    if (existingDriver.role !== USER_ROLES.DRIVER) {
      throw new AppError(
        "El usuario no tiene rol de repartidor",
        HTTP_STATUS_CODES.BAD_REQUEST,
        "Tiene el rol: ",
        existingDriver.role,
      );
    }

    if (existingOrder.status !== ORDER_STATUS.CREATED) {
      throw new AppError(
        "El pedido ya fue asignado o procesado",
        HTTP_STATUS_CODES.CONFLICT,
        "Status actual: ",
        existingOrder.status,
      );
    }

    const newDelivery = await deliveriesRepositorie.createDelivery({
      order,
      driver,
      priority: priority || ORDER_PRIORITY.NORMAL,
      status: DELIVERY_STATUS.ASSIGNED,
      assignedAt: new Date(),
    });

    await ordersServices.updateOrderStatus(order, ORDER_STATUS.ASSIGNED);

    console.log(`Entrega ${newDelivery._id} creada para el pedido ${order}`);
    return newDelivery;
  }

  async updateDeliveryStatus(did, status) {
    const delivery = await deliveriesRepositorie.getDeliveryById(did);
    if (!delivery) {
      throw new AppError("Entrega no encontrada", HTTP_STATUS_CODES.NOT_FOUND);
    }

    if (delivery.status === DELIVERY_STATUS.DELIVERED) {
      throw new AppError(
        "La entrega ya fue completada",
        HTTP_STATUS_CODES.CONFLICT,
        "Status Actual: ",
        delivery.status,
      );
    }

    delivery.status = status;

    if (status === DELIVERY_STATUS.DELIVERED) {
      delivery.deliveredAt = new Date();
      await ordersServices.updateOrderStatus(
        delivery.order,
        ORDER_STATUS.DELIVERED,
      );
    }
    const updatedDelivery = await deliveriesRepositorie.updateDeliveryStatus(
      delivery._id,
      delivery.status,
    );

    console.log(`Entrega ${delivery._id} actualizada a: ${status}`);

    return updatedDelivery;
  }

  async deleteDelivery(did) {
    const delivery = await deliveriesRepositorie.getDeliveryById(did);
    if (!delivery) {
      throw new AppError("Entrega no encontrada", HTTP_STATUS_CODES.NOT_FOUND);
    }
    const deletedDelivery = await deliveriesRepositorie.deleteDelivery(did);
    return deletedDelivery;
  }
}
export default new deliveriesService();
