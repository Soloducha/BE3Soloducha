import receiptsService from "../services/receipts.services.js";
import { HTTP_STATUS } from "../constants/index.js";

class receiptsController {
  async uploadReceipt(req, res, next) {
    try {
      const { entityType, entityId } = req.params;
      const file = req.file;

      const updated = await receiptsService.addReceipt(entityType, entityId, file);

      res.status(200).json({
        status: HTTP_STATUS.SUCCESS,
        payload: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new receiptsController();
