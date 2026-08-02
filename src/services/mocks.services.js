import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.js";
import usersRepositorie from "../repositories/users.repositories.js";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";

const VALID_ROLES = Object.values(USER_ROLES);
const DEFAULT_COUNT = 10;
const MAX_COUNT = 100;

class MocksService {
  /**
   * Valida y normaliza el parametro count.
   * Devuelve el default (10) cuando count es undefined/null.
   * @param {*} count - Cantidad solicitada (query o body)
   * @returns {number} Entero validado entre 1 y 100
   * @throws {AppError} INVALID_MOCK_AMOUNT si no es un entero entre 1 y 100
   */
  validateCount(count) {
    if (count === undefined || count === null) {
      return DEFAULT_COUNT;
    }

    const parsed = Number(count);
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_COUNT) {
      throw new AppError(
        ERROR_CODES.INVALID_MOCK_AMOUNT,
        "La cantidad debe ser un entero entre 1 y 100",
      );
    }

    return parsed;
  }

  /**
   * Genera un array de objetos de usuario simulados SIN persistirlos.
   * @param {number} count - Cantidad de usuarios a generar (default: 10)
   * @returns {Array<Object>} Array de objetos usuario con estructura similar al modelo real
   */
  generateMockUsers(count) {
    const validCount = this.validateCount(count);
    const users = [];

    for (let i = 0; i < validCount; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      users.push({
        firstName,
        lastName,
        email: faker.internet
          .email({ firstName, lastName })
          .toLowerCase(),
        password: faker.internet.password({ length: 12 }),
        role: faker.helpers.arrayElement(VALID_ROLES),
        documents: [],
        createdAt: faker.date.past({ years: 1 }),
        updatedAt: faker.date.recent(),
      });
    }

    return users;
  }

  /**
   * Genera y persiste usuarios simulados en MongoDB.
   * Asigna un email único por usuario para evitar conflictos.
   * @param {number} count - Cantidad de usuarios a insertar (default: 10)
   * @returns {Array<Object>} Array de usuarios creados (con _id y timestamps reales)
   */
  async insertMockUsers(count) {
    const validCount = this.validateCount(count);
    const users = this.generateMockUsers(validCount);
    const createdUsers = [];

    for (const userData of users) {
      // Garantizar unicidad de email agregando sufijo único
      const uniqueEmail = `${userData.email.split("@")[0]}+${faker.string.alphanumeric(6)}@${userData.email.split("@")[1]}`;
      const created = await usersRepositorie.createUser({
        ...userData,
        email: uniqueEmail,
      });
      createdUsers.push(created);
    }

    return createdUsers;
  }
}

export default new MocksService();
