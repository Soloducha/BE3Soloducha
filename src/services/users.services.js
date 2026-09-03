import usersRepositorie from "../repositories/users.repositories.js";
import { AppError } from "../utils/errors.js";
import { USER_ROLES } from "../constants/index.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import { logger } from "../utils/logger.js";

const ALLOWED_DOC_TYPES = ["document", "license", "proof"];

class usersService {
  async getAllUsers() {
    return usersRepositorie.getAllUsers();
  }

  async paginated({ page = 1, limit = 10 }) {
    const currentPage = Number(page);
    const currentLimit = Number(limit);
    const result = await usersRepositorie.paginated({
      page: currentPage,
      limit: currentLimit,
    });
    const totalDocuments = await usersRepositorie.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      docs: result,
      count: result.length,
      total: totalDocuments,
      totalPages,
      page: currentPage,
      hasPreviousPage: currentPage > 1,
      hasNextPages: currentPage < totalPages,
      prevLink:
        currentPage > 1
          ? `/api/users?page=${currentPage - 1}&limit=${currentLimit}`
          : null,
      nextLink:
        currentPage < totalPages
          ? `/api/users?page=${currentPage + 1}&limit=${currentLimit}`
          : null,
    };
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
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Faltan datos obligatorios",
      );
    }

    if (role === USER_ROLES.ADMIN) {
      throw new AppError(ERROR_CODES.FORBIDDEN, "No puedes crear admin");
    }

    const existingUser = await usersRepositorie.getUserByEmail(userData.email);
    if (existingUser) {
      throw new AppError(ERROR_CODES.CONFLICT, "El email ya está registrado");
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

  async addDocument(uid, file, type) {
    if (!file) {
      throw new AppError(ERROR_CODES.FILE_NOT_FOUND, "Archivo no encontrado");
    }

    if (!type || !ALLOWED_DOC_TYPES.includes(type)) {
      throw new AppError(
        ERROR_CODES.INVALID_DOCUMENT_TYPE,
        `Tipo de documento inválido. Tipos permitidos: ${ALLOWED_DOC_TYPES.join(", ")}`,
      );
    }

    const user = await usersRepositorie.getUserById(uid);
    if (!user) {
      throw new AppError(ERROR_CODES.USER_NOT_FOUND, "Usuario no encontrado");
    }

    const document = {
      name: file.originalname,
      reference: file.filename,
      type,
      mimetype: file.mimetype,
      size: file.size,
      uploadedAt: new Date(),
    };

    user.documents.push(document);
    await usersRepositorie.updateUser(uid, { documents: user.documents });

    logger.info(
      `Documento "${file.originalname}" subido para el usuario ${uid}`,
    );

    return user;
  }
}

export default new usersService();
