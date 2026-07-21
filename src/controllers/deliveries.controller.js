import deliveriesService from "../services/deliveries.services.js";
import { HTTP_STATUS } from "../constants/index.js";

class deliveriesController {
  async getAllDeliveries(req, res, next) {
    try {
      const deliveries = await deliveriesService.getAllDeliveries();
      res.json({ status: HTTP_STATUS.SUCCESS, payload: deliveries });
    } catch (error) {
      next(error);
    }
  }

  async getDeliveryById(req, res, next) {
    try {
      const delivery = await deliveriesService.getDeliveryById(req.params.did);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: delivery });
    } catch (error) {
      next(error);
    }
  }

  async createDelivery(req, res, next) {
    try {
      const newDelivery = await deliveriesService.createDelivery(req.body);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: newDelivery });
    } catch (error) {
      next(error);
    }
  }

  async updateDeliveryStatus(req, res, next) {
    try {
      const updatedDelivery = await deliveriesService.updateDeliveryStatus(
        req.params.did,
        req.body.status,
      );
      res.json({ status: HTTP_STATUS.SUCCESS, payload: updatedDelivery });
    } catch (error) {
      next(error);
    }
  }

  async deleteDelivery(req, res, next) {
    try {
      const deletedDelivery = await deliveriesService.deleteDelivery(
        req.params.did,
      );
      res.json({ status: HTTP_STATUS.SUCCESS, payload: deletedDelivery });
    } catch (error) {
      next(error);
    }
  }
}

export default new deliveriesController();
