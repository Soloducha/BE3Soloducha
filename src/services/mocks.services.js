import { faker } from "@faker-js/faker";
import {
  DELIVERY_STATUS,
  ORDER_PRIORITY,
  ORDER_STATUS,
  PRODUCT_STATUS,
  USER_ROLES,
} from "../constants/index.js";
import { ERROR_CODES } from "../constants/error.codes.js";
import deliveriesRepositorie from "../repositories/deliveries.repositories.js";
import ordersRepositorie from "../repositories/orders.repositories.js";
import productsRepositorie from "../repositories/products.repositories.js";
import usersRepositorie from "../repositories/users.repositories.js";
import { AppError } from "../utils/errors.js";

const VALID_ROLES = Object.values(USER_ROLES);
const VALID_PRODUCT_STATUSES = Object.values(PRODUCT_STATUS);
const VALID_ORDER_PRIORITIES = Object.values(ORDER_PRIORITY);
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

  /**
   * Genera un array de objetos de producto simulados SIN persistirlos.
   * @param {number} count - Cantidad de productos a generar (default: 10)
   * @returns {Array<Object>} Array de objetos producto con estructura similar al modelo real
   */
  generateMockProducts(count) {
    const validCount = this.validateCount(count);
    const products = [];

    for (let i = 0; i < validCount; i++) {
      products.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: Number(faker.commerce.price({ min: 100, max: 100000, dec: 2 })),
        stock: faker.number.int({ min: 0, max: 500 }),
        category: faker.commerce.department(),
        status: faker.helpers.arrayElement(VALID_PRODUCT_STATUSES),
      });
    }

    return products;
  }

  /**
   * Genera y persiste productos simulados en MongoDB.
   * @param {number} count - Cantidad de productos a insertar (default: 10)
   * @returns {Array<Object>} Array de productos creados (con _id y timestamps reales)
   */
  async insertMockProducts(count) {
    const validCount = this.validateCount(count);
    const products = this.generateMockProducts(validCount);
    const createdProducts = [];

    for (const productData of products) {
      const created = await productsRepositorie.createProduct(productData);
      createdProducts.push(created);
    }

    return createdProducts;
  }

  /**
   * Genera un array de pedidos simulados SIN persistirlos.
   * Usa usuarios existentes de la DB como customer y productos existentes
   * para armar los items. Si no hay productos, genera items con faker.
   * @param {number} count - Cantidad de pedidos a generar (default: 10)
   * @returns {Array<Object>} Array de objetos pedido con estructura similar al modelo real
   * @throws {AppError} MOCK_SOURCE_EMPTY si no hay usuarios en la DB
   */
  async generateMockOrders(count) {
    const validCount = this.validateCount(count);
    const users = await usersRepositorie.getAllUsers();

    if (!users.length) {
      throw new AppError(
        ERROR_CODES.MOCK_SOURCE_EMPTY,
        "No hay usuarios para generar mocks de orders",
      );
    }

    const products = await productsRepositorie.getAllProducts();
    const orders = [];

    for (let i = 0; i < validCount; i++) {
      const customer = faker.helpers.arrayElement(users);
      const itemCount = faker.number.int({ min: 1, max: 3 });
      const items = [];

      for (let j = 0; j < itemCount; j++) {
        if (products.length) {
          const product = faker.helpers.arrayElement(products);
          items.push({
            name: product.name,
            price: product.price,
            quantity: faker.number.int({ min: 1, max: 5 }),
          });
        } else {
          items.push({
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price({ min: 100, max: 50000, dec: 2 })),
            quantity: faker.number.int({ min: 1, max: 5 }),
          });
        }
      }

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      orders.push({
        customer: customer._id,
        items,
        deliveryAddress: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.country()}`,
        total,
        status: ORDER_STATUS.CREATED,
        priority: faker.helpers.arrayElement(VALID_ORDER_PRIORITIES),
      });
    }

    return orders;
  }

  /**
   * Genera y persiste pedidos simulados en MongoDB.
   * El total de cada pedido se calcula como la suma de items (price * quantity).
   * @param {number} count - Cantidad de pedidos a insertar (default: 10)
   * @returns {Array<Object>} Array de pedidos creados (con _id y timestamps reales)
   */
  async insertMockOrders(count) {
    const validCount = this.validateCount(count);
    const orders = await this.generateMockOrders(validCount);
    const createdOrders = [];

    for (const orderData of orders) {
      const created = await ordersRepositorie.createOrder(orderData);
      createdOrders.push(created);
    }

    return createdOrders;
  }

  /**
   * Genera un array de entregas simuladas SIN persistirlas.
   * Usa pedidos existentes de la DB como order y un usuario existente como
   * driver. Si no hay usuarios, el driver queda en null.
   * @param {number} count - Cantidad de entregas a generar (default: 10)
   * @returns {Array<Object>} Array de objetos entrega con estructura similar al modelo real
   * @throws {AppError} MOCK_SOURCE_EMPTY si no hay pedidos en la DB
   */
  async generateMockDeliveries(count) {
    const validCount = this.validateCount(count);
    const orders = await ordersRepositorie.getAllOrders();

    if (!orders.length) {
      throw new AppError(
        ERROR_CODES.MOCK_SOURCE_EMPTY,
        "No hay orders para generar mocks de deliveries",
      );
    }

    const users = await usersRepositorie.getAllUsers();
    const deliveries = [];

    for (let i = 0; i < validCount; i++) {
      const order = faker.helpers.arrayElement(orders);

      deliveries.push({
        order: order._id,
        driver: users.length ? faker.helpers.arrayElement(users)._id : null,
        status: DELIVERY_STATUS.PENDING,
        priority: faker.helpers.arrayElement(VALID_ORDER_PRIORITIES),
        assignedAt: null,
      });
    }

    return deliveries;
  }

  /**
   * Genera y persiste entregas simuladas en MongoDB.
   * @param {number} count - Cantidad de entregas a insertar (default: 10)
   * @returns {Array<Object>} Array de entregas creadas (con _id y timestamps reales)
   */
  async insertMockDeliveries(count) {
    const validCount = this.validateCount(count);
    const deliveries = await this.generateMockDeliveries(validCount);
    const createdDeliveries = [];

    for (const deliveryData of deliveries) {
      const created = await deliveriesRepositorie.createDelivery(
        deliveryData.order,
        deliveryData.driver,
        deliveryData.priority,
        deliveryData.status,
        deliveryData.assignedAt,
      );
      createdDeliveries.push(created);
    }

    return createdDeliveries;
  }
}

export default new MocksService();
