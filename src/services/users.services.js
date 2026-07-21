import usersRepositorie from "../repositories/users.repositories.js";
import appError from "../utils/errors.js";
import { USER_ROLES, HTTP_STATUS_CODES } from "../constants/index.js";

class usersService {
  async getAllUsers() {
    return usersRepositorie.getAllUsers();
  }

  async getUserById(uid) {
    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new appError("Usuario no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }
    return user;
  }

  async createUser(userData) {
    const { firstName, lastName, email, password, role } = userData;

    if (!firstName || !lastName || !email || !password) {
      throw new appError(
        "Faltan datos obligatorios",
        HTTP_STATUS_CODES.BAD_REQUEST,
      );
    }

    if (role === USER_ROLES.ADMIN) {
      throw new appError("No puedes crear admin", HTTP_STATUS_CODES.FORBIDDEN);
    }

    const existingUser = await usersRepositorie.getUserByEmail(userData.email);
    if (existingUser) {
      throw new appError(
        "El email ya está registrado",
        HTTP_STATUS_CODES.CONFLICT,
      );
    }

    const newUser = await usersRepositorie.createUser(userData);
    return newUser;
  }

  async updateUser(uid, userData) {
    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new appError("Usuario no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }
    const updatedUser = await usersRepositorie.updateUser(uid, userData);
    return updatedUser;
  }

  async deleteUser(uid) {
    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new appError("Usuario no encontrado", HTTP_STATUS_CODES.NOT_FOUND);
    }
    const deletedUser = await usersRepositorie.deleteUser(uid);
    return deletedUser;
  }
}

export default new usersService();
