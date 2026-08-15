import Delivery from "../models/delivery.model.js";

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

  async updateDeliveryStatus(did, status, deliveredAt = null) {
    const update = { status };
    if (deliveredAt) {
      update.deliveredAt = deliveredAt;
    }
    return await Delivery.findByIdAndUpdate(did, update, {
      new: true,
      runValidators: true,
    });
  }

  async deleteDelivery(did) {
    return await Delivery.findByIdAndDelete(did);
  }
}

export default new deliveriesRepositorie();
