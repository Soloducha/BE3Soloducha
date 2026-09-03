import Delivery from "../models/delivery.model.js";

class deliveriesRepositorie {
  async getAllDeliveries() {
    return Delivery.find();
  }

  async paginated({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    return Delivery.find().skip(skip).limit(limit);
  }

  async countDocuments() {
    return Delivery.countDocuments();
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

  async updateDelivery(did, data) {
    return Delivery.findByIdAndUpdate(did, data, {
      new: true,
      runValidators: true,
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
