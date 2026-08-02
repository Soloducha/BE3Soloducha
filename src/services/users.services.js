import usersRepositorie from "../repositories/users.repositories.js";
import { AppError } from "../utils/errors.js";
import { USER_ROLES } from "../constants/index.js";
import { ERROR_CODES } from "../constants/error.codes.js";

class usersService {
  async getAllUsers() {
    return usersRepositorie.getAllUsers();
  }

  async getUserById(uid) {
    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, "Usuario no encontrado");
    }
    return user;
  }

  async createUser(userData) {
    const { firstName, lastName, email, password, role } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "Faltan datos obligatorios");
    }

    if (role === USER_ROLES.ADMIN) {
      throw new AppError(ERROR_CODES.FORBIDDEN, "No puedes crear admin");
    }

    const existingUser = await usersRepositorie.getUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError(
        ERROR_CODES.CONFLICT,
        "El email ya está registrado",
      );
    }

    const newUser = await usersRepositorie.createUser(userData);
    return newUser;
  }

  async updateUser(uid, userData) {
    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, "Usuario no encontrado");
    }
    const updatedUser = await usersRepositorie.updateUser(uid, userData);
    return updatedUser;
  }

  async deleteUser(uid) {
    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, "Usuario no encontrado");
    }
    const deletedUser = await usersRepositorie.deleteUser(uid);
    return deletedUser;
  }
}

export default new usersService();
