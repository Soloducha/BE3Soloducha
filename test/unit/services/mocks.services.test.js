import { jest } from "@jest/globals";

// Simula el módulo del repositorio
jest.unstable_mockModule(
  "../../../src/repositories/users.repositories.js",
  () => ({
    default: {
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    },
  }),
);

jest.unstable_mockModule(
  "../../../src/repositories/products.repositories.js",
  () => ({
    default: {
      getAllProducts: jest.fn(),
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    },
  }),
);

jest.unstable_mockModule(
  "../../../src/repositories/orders.repositories.js",
  () => ({
    default: {
      getAllOrders: jest.fn(),
      getOrderById: jest.fn(),
      createOrder: jest.fn(),
      updateOrderStatus: jest.fn(),
      deleteOrder: jest.fn(),
    },
  }),
);

jest.unstable_mockModule(
  "../../../src/repositories/deliveries.repositories.js",
  () => ({
    default: {
      getAllDeliveries: jest.fn(),
      getDeliveryById: jest.fn(),
      createDelivery: jest.fn(),
      updateDeliveryStatus: jest.fn(),
      deleteDelivery: jest.fn(),
    },
  }),
);

// Importo todo lo que dependa del módulo simulado
const { default: usersRepositorie } =
  await import("../../../src/repositories/users.repositories.js");
const { default: productsRepositorie } =
  await import("../../../src/repositories/products.repositories.js");
const { default: ordersRepositorie } =
  await import("../../../src/repositories/orders.repositories.js");
const { default: deliveriesRepositorie } =
  await import("../../../src/repositories/deliveries.repositories.js");
const { default: mocksService } =
  await import("../../../src/services/mocks.services.js");
const { ERROR_CODES } = await import("../../../src/constants/error.codes.js");
const { DELIVERY_STATUS, ORDER_STATUS } = await import(
  "../../../src/constants/index.js"
);
const { mockUserFromDB } = await import("../../mocks/users.mock.js");
const { mockProductFromDB } = await import("../../mocks/products.mock.js");
const { mockOrderFromDB } = await import("../../mocks/orders.mock.js");

const INVALID = ERROR_CODES.INVALID_MOCK_AMOUNT;
const SOURCE_EMPTY = ERROR_CODES.MOCK_SOURCE_EMPTY;
const PRODUCT_STATUSES = ["available", "out_of_stock"];
const ORDER_PRIORITIES = ["low", "normal", "high"];

describe("Mocks Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // generateMockUsers
  describe("generateMockUsers", () => {
    it("debería generar N usuarios válidos", () => {
      const users = mocksService.generateMockUsers(5);

      expect(users).toHaveLength(5);
      expect(users[0]).toEqual(
        expect.objectContaining({
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          password: expect.any(String),
          role: expect.any(String),
          documents: expect.any(Array),
        }),
      );
    });

    it("debería generar 10 usuarios por default si count no se envía", () => {
      const users = mocksService.generateMockUsers(undefined);

      expect(users).toHaveLength(10);
    });

    it("debería aceptar un count numérico en string", () => {
      const users = mocksService.generateMockUsers("15");

      expect(users).toHaveLength(15);
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es 0", () => {
      expect(() => mocksService.generateMockUsers(0)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es negativo", () => {
      expect(() => mocksService.generateMockUsers(-5)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count supera 100", () => {
      expect(() => mocksService.generateMockUsers(101)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count no es numérico", () => {
      expect(() => mocksService.generateMockUsers("abc")).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count no es entero", () => {
      expect(() => mocksService.generateMockUsers(15.5)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });
  });

  // insertMockUsers
  describe("insertMockUsers", () => {
    it("debería insertar N usuarios y devolver los creados", async () => {
      usersRepositorie.createUser.mockResolvedValue({ _id: "mock-id" });

      const createdUsers = await mocksService.insertMockUsers(3);

      expect(createdUsers).toHaveLength(3);
      expect(usersRepositorie.createUser).toHaveBeenCalledTimes(3);
    });

    it("debería insertar 10 usuarios por default si count no se envía", async () => {
      usersRepositorie.createUser.mockResolvedValue({ _id: "mock-id" });

      const createdUsers = await mocksService.insertMockUsers(undefined);

      expect(createdUsers).toHaveLength(10);
      expect(usersRepositorie.createUser).toHaveBeenCalledTimes(10);
    });

    it("debería rechazar con INVALID_MOCK_AMOUNT si count es inválido", async () => {
      await expect(mocksService.insertMockUsers(0)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockUsers(-1)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockUsers(101)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockUsers("abc")).rejects.toMatchObject({
        code: INVALID,
      });
    });

    it("debería propagar errores del repositorio", async () => {
      usersRepositorie.createUser.mockRejectedValue(new Error("DB caido"));

      await expect(mocksService.insertMockUsers(2)).rejects.toThrow(
        "DB caido",
      );
    });
  });

  // generateMockProducts
  describe("generateMockProducts", () => {
    it("debería generar N productos válidos", () => {
      const products = mocksService.generateMockProducts(5);

      expect(products).toHaveLength(5);
      expect(products[0]).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          stock: expect.any(Number),
          category: expect.any(String),
          status: expect.any(String),
        }),
      );
    });

    it("debería generar 10 productos por default si count no se envía", () => {
      const products = mocksService.generateMockProducts(undefined);

      expect(products).toHaveLength(10);
    });

    it("debería usar un status válido del enum PRODUCT_STATUS", () => {
      const products = mocksService.generateMockProducts(20);

      for (const product of products) {
        expect(PRODUCT_STATUSES).toContain(product.status);
      }
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es 0", () => {
      expect(() => mocksService.generateMockProducts(0)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count supera 100", () => {
      expect(() => mocksService.generateMockProducts(101)).toThrow(
        expect.objectContaining({ code: INVALID }),
      );
    });
  });

  // insertMockProducts
  describe("insertMockProducts", () => {
    it("debería insertar N productos y devolver los creados", async () => {
      productsRepositorie.createProduct.mockResolvedValue({ _id: "mock-id" });

      const createdProducts = await mocksService.insertMockProducts(3);

      expect(createdProducts).toHaveLength(3);
      expect(productsRepositorie.createProduct).toHaveBeenCalledTimes(3);
    });

    it("debería llamar a createProduct con los datos generados", async () => {
      productsRepositorie.createProduct.mockResolvedValue({ _id: "mock-id" });

      await mocksService.insertMockProducts(1);

      expect(productsRepositorie.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          price: expect.any(Number),
          stock: expect.any(Number),
          category: expect.any(String),
          status: expect.any(String),
        }),
      );
    });

    it("debería rechazar con INVALID_MOCK_AMOUNT si count es inválido", async () => {
      await expect(mocksService.insertMockProducts(0)).rejects.toMatchObject({
        code: INVALID,
      });
      await expect(mocksService.insertMockProducts(101)).rejects.toMatchObject({
        code: INVALID,
      });
    });

    it("debería propagar errores del repositorio", async () => {
      productsRepositorie.createProduct.mockRejectedValue(new Error("DB caido"));

      await expect(mocksService.insertMockProducts(2)).rejects.toThrow(
        "DB caido",
      );
    });
  });

  // generateMockOrders
  describe("generateMockOrders", () => {
    it("debería lanzar MOCK_SOURCE_EMPTY si no hay usuarios", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([]);

      await expect(mocksService.generateMockOrders(5)).rejects.toMatchObject({
        code: SOURCE_EMPTY,
        statusCode: 400,
      });
    });

    it("debería construir customer con usuarios reales e items con productos reales", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([
        mockProductFromDB,
      ]);

      const orders = await mocksService.generateMockOrders(3);

      expect(orders).toHaveLength(3);
      for (const order of orders) {
        expect(order.customer).toBe(mockUserFromDB._id);
        expect(order.items.length).toBeGreaterThanOrEqual(1);
        expect(order.items.length).toBeLessThanOrEqual(3);
        for (const item of order.items) {
          expect(item.name).toBe(mockProductFromDB.name);
          expect(item.price).toBe(mockProductFromDB.price);
          expect(item.quantity).toBeGreaterThanOrEqual(1);
          expect(item.quantity).toBeLessThanOrEqual(5);
        }
      }
      expect(usersRepositorie.getAllUsers).toHaveBeenCalledTimes(1);
      expect(productsRepositorie.getAllProducts).toHaveBeenCalledTimes(1);
    });

    it("debería generar items con faker cuando no hay productos", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([]);

      const orders = await mocksService.generateMockOrders(2);

      expect(orders).toHaveLength(2);
      for (const order of orders) {
        expect(order.customer).toBe(mockUserFromDB._id);
        for (const item of order.items) {
          expect(item).toEqual(
            expect.objectContaining({
              name: expect.any(String),
              price: expect.any(Number),
              quantity: expect.any(Number),
            }),
          );
        }
      }
    });

    it("debería calcular el total como suma de items (price * quantity)", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([
        mockProductFromDB,
      ]);

      const [order] = await mocksService.generateMockOrders(1);
      const expectedTotal = order.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      expect(order.total).toBe(expectedTotal);
      expect(order.status).toBe(ORDER_STATUS.CREATED);
      expect(ORDER_PRIORITIES).toContain(order.priority);
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es inválido sin consultar la DB", async () => {
      await expect(mocksService.generateMockOrders(0)).rejects.toMatchObject({
        code: INVALID,
      });
      expect(usersRepositorie.getAllUsers).not.toHaveBeenCalled();
    });
  });

  // insertMockOrders
  describe("insertMockOrders", () => {
    it("debería insertar N pedidos y llamar a createOrder por cada uno", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([
        mockProductFromDB,
      ]);
      ordersRepositorie.createOrder.mockResolvedValue({ _id: "mock-id" });

      const createdOrders = await mocksService.insertMockOrders(3);

      expect(createdOrders).toHaveLength(3);
      expect(ordersRepositorie.createOrder).toHaveBeenCalledTimes(3);
    });

    it("debería llamar a createOrder con los datos generados", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([]);
      ordersRepositorie.createOrder.mockResolvedValue({ _id: "mock-id" });

      await mocksService.insertMockOrders(1);

      expect(ordersRepositorie.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: mockUserFromDB._id,
          items: expect.any(Array),
          deliveryAddress: expect.any(String),
          total: expect.any(Number),
          status: ORDER_STATUS.CREATED,
          priority: expect.any(String),
        }),
      );
    });

    it("debería lanzar MOCK_SOURCE_EMPTY si no hay usuarios", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([]);

      await expect(mocksService.insertMockOrders(2)).rejects.toMatchObject({
        code: SOURCE_EMPTY,
      });
      expect(ordersRepositorie.createOrder).not.toHaveBeenCalled();
    });
  });

  // generateMockDeliveries
  describe("generateMockDeliveries", () => {
    it("debería lanzar MOCK_SOURCE_EMPTY si no hay orders", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([]);

      await expect(mocksService.generateMockDeliveries(5)).rejects.toMatchObject(
        {
          code: SOURCE_EMPTY,
          statusCode: 400,
        },
      );
    });

    it("debería usar orders reales y driver null cuando no hay usuarios", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([]);

      const deliveries = await mocksService.generateMockDeliveries(2);

      expect(deliveries).toHaveLength(2);
      for (const delivery of deliveries) {
        expect(delivery.order).toBe(mockOrderFromDB._id);
        expect(delivery.driver).toBeNull();
        expect(delivery.status).toBe(DELIVERY_STATUS.PENDING);
        expect(ORDER_PRIORITIES).toContain(delivery.priority);
        expect(delivery.assignedAt).toBeNull();
      }
      expect(ordersRepositorie.getAllOrders).toHaveBeenCalledTimes(1);
    });

    it("debería asignar un driver real cuando hay usuarios", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);

      const deliveries = await mocksService.generateMockDeliveries(2);

      expect(deliveries).toHaveLength(2);
      for (const delivery of deliveries) {
        expect(delivery.driver).toBe(mockUserFromDB._id);
      }
    });

    it("debería lanzar INVALID_MOCK_AMOUNT si count es inválido sin consultar la DB", async () => {
      await expect(
        mocksService.generateMockDeliveries(0),
      ).rejects.toMatchObject({ code: INVALID });
      expect(ordersRepositorie.getAllOrders).not.toHaveBeenCalled();
    });
  });

  // insertMockDeliveries
  describe("insertMockDeliveries", () => {
    it("debería insertar N entregas y llamar a createDelivery por cada una", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      deliveriesRepositorie.createDelivery.mockResolvedValue({ _id: "mock-id" });

      const createdDeliveries = await mocksService.insertMockDeliveries(3);

      expect(createdDeliveries).toHaveLength(3);
      expect(deliveriesRepositorie.createDelivery).toHaveBeenCalledTimes(3);
    });

    it("debería llamar a createDelivery con la firma posicional", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      deliveriesRepositorie.createDelivery.mockResolvedValue({ _id: "mock-id" });

      await mocksService.insertMockDeliveries(1);

      expect(deliveriesRepositorie.createDelivery).toHaveBeenCalledWith(
        mockOrderFromDB._id,
        mockUserFromDB._id,
        expect.any(String),
        DELIVERY_STATUS.PENDING,
        null,
      );
    });

    it("debería pasar driver null cuando no hay usuarios", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([]);
      deliveriesRepositorie.createDelivery.mockResolvedValue({ _id: "mock-id" });

      await mocksService.insertMockDeliveries(1);

      expect(deliveriesRepositorie.createDelivery).toHaveBeenCalledWith(
        mockOrderFromDB._id,
        null,
        expect.any(String),
        DELIVERY_STATUS.PENDING,
        null,
      );
    });

    it("debería lanzar MOCK_SOURCE_EMPTY si no hay orders", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([]);

      await expect(mocksService.insertMockDeliveries(2)).rejects.toMatchObject({
        code: SOURCE_EMPTY,
      });
      expect(deliveriesRepositorie.createDelivery).not.toHaveBeenCalled();
    });
  });
});
