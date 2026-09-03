import ordersRepositorie from "../repositories/orders.repositories.js";
import deliveriesRepositorie from "../repositories/deliveries.repositories.js";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { logger } from "../utils/logger.js";

// Estrategia por entidad: cada tipo de entidad aporta una interfaz uniforme
// (getById / updateById) para que el service no tenga que preguntar qué entidad
// es en cada paso. Agregar una entidad nueva = sumar una entrada acá.
const ENTITY_STRATEGY = {
  orders: {
    notFoundCode: ERROR_CODES.ORDER_NOT_FOUND,
    name: "Pedido",
    getById: (id) => ordersRepositorie.getOrderById(id),
    updateById: (id, data) => ordersRepositorie.updateOrder(id, data),
  },
  deliveries: {
    notFoundCode: ERROR_CODES.DELIVERY_NOT_FOUND,
    name: "Entrega",
    getById: (id) => deliveriesRepositorie.getDeliveryById(id),
    updateById: (id, data) => deliveriesRepositorie.updateDelivery(id, data),
  },
};

class receiptsService {
  async addReceipt(entityType, entityId, file) {
    if (!file) {
      throw new AppError(ERROR_CODES.FILE_NOT_FOUND, "Archivo no encontrado");
    }

    const strategy = ENTITY_STRATEGY[entityType];
    if (!strategy) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Tipo de entidad no válido",
      );
    }

    const entity = await strategy.getById(entityId);
    if (!entity) {
      throw new AppError(
        strategy.notFoundCode,
        `${strategy.name} no encontrado`,
      );
    }

    const document = {
      name: file.originalname,
      reference: file.filename,
      type: "proof",
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };

    entity.documents.push(document);

    const updated = await strategy.updateById(entityId, {
      documents: entity.documents,
    });

    logger.info(
      `Comprobante "${file.originalname}" asociado a ${strategy.name} ${entityId}`,
    );

    return updated;
  }
}

export default new receiptsService();
