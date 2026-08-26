import ordersRepositorie from "../repositories/orders.repositories.js";
import deliveriesRepositorie from "../repositories/deliveries.repositories.js";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { logger } from "../utils/logger.js";

const ENTITY_REPOSITORIES = {
  orders: ordersRepositorie,
  deliveries: deliveriesRepositorie,
};

const ENTITY_NOT_FOUND_CODES = {
  orders: ERROR_CODES.ORDER_NOT_FOUND,
  deliveries: ERROR_CODES.DELIVERY_NOT_FOUND,
};

const ENTITY_NAMES = {
  orders: "Pedido",
  deliveries: "Entrega",
};

class receiptsService {
  async addReceipt(entityType, entityId, file) {
    if (!file) {
      throw new AppError(ERROR_CODES.FILE_NOT_FOUND, "Archivo no encontrado");
    }

    const repo = ENTITY_REPOSITORIES[entityType];
    if (!repo) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Tipo de entidad no válido",
      );
    }

    const entity =
      entityType === "orders"
        ? await repo.getOrderById(entityId)
        : await repo.getDeliveryById(entityId);

    if (!entity) {
      throw new AppError(
        ENTITY_NOT_FOUND_CODES[entityType],
        `${ENTITY_NAMES[entityType]} no encontrado`,
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

    let updated;
    if (entityType === "orders") {
      updated = await repo.updateOrder(entityId, {
        documents: entity.documents,
      });
    } else {
      updated = await repo.updateDelivery(entityId, {
        documents: entity.documents,
      });
    }

    logger.info(
      `Comprobante "${file.originalname}" asociado a ${ENTITY_NAMES[entityType]} ${entityId}`,
    );

    return updated;
  }
}

export default new receiptsService();
