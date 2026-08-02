import usersService from "../services/users.services.js";
import { HTTP_STATUS } from "../constants/index.js";

class usersController {
  async getAllUsers(req, res, next) {
    try {
      const users = await usersService.getAllUsers();
      res.json({ status: HTTP_STATUS.SUCCESS, payload: users });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res, next) {
    try {
      const user = await usersService.getUserById(req.params.uid);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: user });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const newUser = await usersService.createUser(req.body);
      res.status(201).json({ status: HTTP_STATUS.SUCCESS, payload: newUser });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await usersService.updateUser(
        req.params.uid,
        req.body,
      );
      res.json({ status: HTTP_STATUS.SUCCESS, payload: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const deletedUser = await usersService.deleteUser(req.params.uid);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: deletedUser });
    } catch (error) {
      next(error);
    }
  }
}

export default new usersController();
