import mocksService from "../services/mocks.services.js";
import { HTTP_STATUS } from "../constants/index.js";

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
}

export default new MocksController();
