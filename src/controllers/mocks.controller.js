import mocksService from "../services/mocks.services.js";
import { HTTP_STATUS } from "../constants/index.js";
import { logger } from "../utils/logger.js";

class MocksController {
  /**
   * GET /api/mocks/users
   * Genera y devuelve usuarios simulados SIN persistirlos.
   * Query params: ?count=15 (default: 10)
   */
  async generateUsers(req, res, next) {
    try {
      const users = mocksService.generateMockUsers(req.query.count);

      res.json({
        status: HTTP_STATUS.SUCCESS,
        payload: users,
        total: users.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/mocks/users
   * Genera e inserta usuarios simulados en MongoDB.
   * Body: { count: 15 } (default: 10)
   */
  async insertUsers(req, res, next) {
    try {
      const users = await mocksService.insertMockUsers(req.body.count);

      res.status(201).json({
        status: HTTP_STATUS.SUCCESS,
        payload: users,
        total: users.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mocks/products
   * Genera y devuelve productos simulados SIN persistirlos.
   * Query params: ?count=15 (default: 10)
   */
  async generateProducts(req, res, next) {
    try {
      const products = mocksService.generateMockProducts(req.query.count);

      res.json({
        status: HTTP_STATUS.SUCCESS,
        payload: products,
        total: products.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/mocks/products
   * Genera e inserta productos simulados en MongoDB.
   * Body: { count: 15 } (default: 10)
   */
  async insertProducts(req, res, next) {
    try {
      const products = await mocksService.insertMockProducts(req.body.count);

      res.status(201).json({
        status: HTTP_STATUS.SUCCESS,
        payload: products,
        total: products.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mocks/orders
   * Genera y devuelve pedidos simulados SIN persistirlos.
   * Requiere usuarios existentes en la DB (como customer).
   * Query params: ?count=15 (default: 10)
   */
  async generateOrders(req, res, next) {
    try {
      const orders = await mocksService.generateMockOrders(req.query.count);

      res.json({
        status: HTTP_STATUS.SUCCESS,
        payload: orders,
        total: orders.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/mocks/orders
   * Genera e inserta pedidos simulados en MongoDB.
   * Body: { count: 15 } (default: 10)
   */
  async insertOrders(req, res, next) {
    try {
      const orders = await mocksService.insertMockOrders(req.body.count);

      res.status(201).json({
        status: HTTP_STATUS.SUCCESS,
        payload: orders,
        total: orders.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/mocks/deliveries
   * Genera y devuelve entregas simuladas SIN persistirlas.
   * Requiere pedidos existentes en la DB (como order).
   * Query params: ?count=15 (default: 10)
   */
  async generateDeliveries(req, res, next) {
    try {
      const deliveries = await mocksService.generateMockDeliveries(
        req.query.count,
      );

      res.json({
        status: HTTP_STATUS.SUCCESS,
        payload: deliveries,
        total: deliveries.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/mocks/deliveries
   * Genera e inserta entregas simuladas en MongoDB.
   * Body: { count: 15 } (default: 10)
   */
  async insertDeliveries(req, res, next) {
    try {
      const deliveries = await mocksService.insertMockDeliveries(
        req.body.count,
      );

      res.status(201).json({
        status: HTTP_STATUS.SUCCESS,
        payload: deliveries,
        total: deliveries.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async generateLogs(req, res, next) {
    logger.debug("test debug log");
    logger.http("test http log");
    logger.info("test info log");
    logger.warn("test warning log");
    logger.error("test error log");
    logger.fatal("test fatal log");
    res.status(200).json({
      status: HTTP_STATUS.SUCCESS,
      message: "Logs generados en los 6 niveles",
    });
  }
}

export default new MocksController();
