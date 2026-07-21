import Delivery from "../models/delivery.model";
import Product from "../models/product.model";

class deliveriesRepositorie {
  async getAllDeliveries() {
    return Delivery.find();
  }

  async getDeliveryById(did) {
    return Delivery.findById(did);
  }

  async createDelivery(order, driver, priority, status, assignedAt) {
    return await Delivery.create({
      order,
      driver,
      priority,
      status,
      assignedAt,
    });
  }

  async updateDeliveryStatus(did, status) {
    return await Delivery.findByIdAndUpdate(did, status, { new: true });
  }

  async deleteDelivery(did) {
    return await Delivery.findByIdAndDelete(did);
  }
}

export default new deliveriesRepositorie();
