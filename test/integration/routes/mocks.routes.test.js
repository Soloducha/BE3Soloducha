import { jest } from "@jest/globals";
import request from "supertest";

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
const { default: app } = await import("../../../src/app.js");
const { mockUserFromDB } = await import("../../mocks/users.mock.js");
const { mockProductFromDB } = await import("../../mocks/products.mock.js");
const { mockOrderFromDB } = await import("../../mocks/orders.mock.js");
const { mockDeliveryFromDB } = await import("../../mocks/deliveries.mock.js");

const INVALID_MOCK_AMOUNT = "INVALID_MOCK_AMOUNT";
const MOCK_SOURCE_EMPTY = "MOCK_SOURCE_EMPTY";

describe("Mocks Routes - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/mocks/users
  describe("GET /api/mocks/users", () => {
    it("debería generar 15 usuarios con count=15", async () => {
      const res = await request(app).get("/api/mocks/users?count=15");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(15);
      expect(res.body.total).toBe(15);
    });

    it("debería generar 10 usuarios por default si no se envía count", async () => {
      const res = await request(app).get("/api/mocks/users");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(10);
      expect(res.body.total).toBe(10);
    });

    it("debería generar 100 usuarios con count=100", async () => {
      const res = await request(app).get("/api/mocks/users?count=100");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(100);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es negativo", async () => {
      const res = await request(app).get("/api/mocks/users?count=-5");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count es 0", async () => {
      const res = await request(app).get("/api/mocks/users?count=0");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count no es numérico", async () => {
      const res = await request(app).get("/api/mocks/users?count=abc");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count supera 100", async () => {
      const res = await request(app).get("/api/mocks/users?count=101");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });
  });

  // POST /api/mocks/users
  describe("POST /api/mocks/users", () => {
    it("debería insertar 5 usuarios con count=5", async () => {
      usersRepositorie.createUser.mockResolvedValue(mockUserFromDB);

      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: 5 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(5);
      expect(res.body.total).toBe(5);
      expect(usersRepositorie.createUser).toHaveBeenCalledTimes(5);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es negativo", async () => {
      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: -1 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 500 si falla la inserción en la base de datos", async () => {
      usersRepositorie.createUser.mockRejectedValue(new Error("DB caido"));

      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: 2 });

      expect(res.status).toBe(500);
      expect(res.body.status).toBe("error");
      expect(res.body.error).toBe("INTERNAL_SERVER_ERROR");
    });
  });

  // GET /api/mocks/products
  describe("GET /api/mocks/products", () => {
    it("debería generar 5 productos con count=5", async () => {
      const res = await request(app).get("/api/mocks/products?count=5");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(5);
      expect(res.body.total).toBe(5);
    });

    it("debería generar 10 productos por default si no se envía count", async () => {
      const res = await request(app).get("/api/mocks/products");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(10);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es negativo", async () => {
      const res = await request(app).get("/api/mocks/products?count=-5");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });

    it("debería devolver 400 si count supera 100", async () => {
      const res = await request(app).get("/api/mocks/products?count=101");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });
  });

  // POST /api/mocks/products
  describe("POST /api/mocks/products", () => {
    it("debería insertar 3 productos con count=3", async () => {
      productsRepositorie.createProduct.mockResolvedValue(mockProductFromDB);

      const res = await request(app)
        .post("/api/mocks/products")
        .send({ count: 3 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(3);
      expect(res.body.total).toBe(3);
      expect(productsRepositorie.createProduct).toHaveBeenCalledTimes(3);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es 0", async () => {
      const res = await request(app)
        .post("/api/mocks/products")
        .send({ count: 0 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });
  });

  // GET /api/mocks/orders
  describe("GET /api/mocks/orders", () => {
    it("debería generar 2 pedidos con count=2 cuando hay usuarios y productos", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([
        mockProductFromDB,
      ]);

      const res = await request(app).get("/api/mocks/orders?count=2");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(2);
      expect(res.body.total).toBe(2);
      for (const order of res.body.payload) {
        expect(order.customer).toBe(mockUserFromDB._id);
        expect(order.total).toBeGreaterThan(0);
      }
    });

    it("debería devolver 400 con MOCK_SOURCE_EMPTY si no hay usuarios", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([]);

      const res = await request(app).get("/api/mocks/orders");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(MOCK_SOURCE_EMPTY);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es negativo", async () => {
      const res = await request(app).get("/api/mocks/orders?count=-5");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });
  });

  // POST /api/mocks/orders
  describe("POST /api/mocks/orders", () => {
    it("debería insertar 2 pedidos con count=2", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      productsRepositorie.getAllProducts.mockResolvedValue([
        mockProductFromDB,
      ]);
      ordersRepositorie.createOrder.mockResolvedValue(mockOrderFromDB);

      const res = await request(app)
        .post("/api/mocks/orders")
        .send({ count: 2 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(ordersRepositorie.createOrder).toHaveBeenCalledTimes(2);
    });

    it("debería devolver 400 con MOCK_SOURCE_EMPTY si no hay usuarios", async () => {
      usersRepositorie.getAllUsers.mockResolvedValue([]);

      const res = await request(app)
        .post("/api/mocks/orders")
        .send({ count: 2 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(MOCK_SOURCE_EMPTY);
    });
  });

  // GET /api/mocks/deliveries
  describe("GET /api/mocks/deliveries", () => {
    it("debería generar 2 entregas con count=2 cuando hay orders y usuarios", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);

      const res = await request(app).get("/api/mocks/deliveries?count=2");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(2);
      expect(res.body.total).toBe(2);
      for (const delivery of res.body.payload) {
        expect(delivery.order).toBe(mockOrderFromDB._id);
        expect(delivery.driver).toBe(mockUserFromDB._id);
      }
    });

    it("debería devolver 400 con MOCK_SOURCE_EMPTY si no hay orders", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([]);

      const res = await request(app).get("/api/mocks/deliveries");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(MOCK_SOURCE_EMPTY);
    });

    it("debería devolver 400 con INVALID_MOCK_AMOUNT si count es 0", async () => {
      const res = await request(app).get("/api/mocks/deliveries?count=0");

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(INVALID_MOCK_AMOUNT);
    });
  });

  // POST /api/mocks/deliveries
  describe("POST /api/mocks/deliveries", () => {
    it("debería insertar 2 entregas con count=2", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);
      usersRepositorie.getAllUsers.mockResolvedValue([mockUserFromDB]);
      deliveriesRepositorie.createDelivery.mockResolvedValue(mockDeliveryFromDB);

      const res = await request(app)
        .post("/api/mocks/deliveries")
        .send({ count: 2 });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(2);
      expect(res.body.total).toBe(2);
      expect(deliveriesRepositorie.createDelivery).toHaveBeenCalledTimes(2);
    });

    it("debería devolver 400 con MOCK_SOURCE_EMPTY si no hay orders", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([]);

      const res = await request(app)
        .post("/api/mocks/deliveries")
        .send({ count: 2 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
      expect(res.body.error).toBe(MOCK_SOURCE_EMPTY);
    });
  });
});
