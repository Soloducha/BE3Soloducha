import { faker } from "@faker-js/faker";
import { USER_ROLES } from "../constants/index.js";
import usersRepositorie from "../repositories/users.repositories.js";

const VALID_ROLES = Object.values(USER_ROLES);

class MocksService {
  /**
   * Genera un array de objetos de usuario simulados SIN persistirlos.
   * @param {number} count - Cantidad de usuarios a generar (default: 10)
   * @returns {Array<Object>} Array de objetos usuario con estructura similar al modelo real
   */
  generateMockUsers(count = 10) {
    const users = [];

    for (let i = 0; i < count; i++) {
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
  async insertMockUsers(count = 10) {
    const users = this.generateMockUsers(count);
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
