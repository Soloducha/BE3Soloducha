import { jest } from "@jest/globals";
import request from "supertest";

// Simula los módulos de los repositorios y del servicio de pedidos
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

jest.unstable_mockModule("../../../src/services/orders.services.js", () => ({
  default: {
    getAllOrders: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    deleteOrder: jest.fn(),
  },
}));

// Importo todo lo que dependa de los módulos simulados
const { default: deliveriesRepositorie } =
  await import("../../../src/repositories/deliveries.repositories.js");
const { default: usersRepositorie } =
  await import("../../../src/repositories/users.repositories.js");
const { default: ordersServices } =
  await import("../../../src/services/orders.services.js");
const { default: app } = await import("../../../src/app.js");
const {
  validDelivery,
  deliveryWithoutOrder,
  deliveryWithoutDriver,
  mockDriverUser,
  mockNonDriverUser,
  mockOrderCreated,
  mockOrderNotCreated,
  mockDeliveryFromDB,
  mockDeliveryDelivered,
  mockUpdatedDelivery,
} = await import("../../mocks/deliveries.mock.js");

describe("Deliveries Routes - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/deliveries
  describe("GET /api/deliveries", () => {
    it("debería devolver todas las entregas", async () => {
      deliveriesRepositorie.getAllDeliveries.mockResolvedValue([
        mockDeliveryFromDB,
      ]);

      const res = await request(app).get("/api/deliveries");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(1);
      expect(res.body.payload[0].order).toBe(mockDeliveryFromDB.order);
    });
  });

  // GET /api/deliveries/:did
  describe("GET /api/deliveries/:did", () => {
    it("debería devolver una entrega por ID", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(mockDeliveryFromDB);

      const res = await request(app).get(
        `/api/deliveries/${mockDeliveryFromDB._id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.driver).toBe(mockDeliveryFromDB.driver);
    });

    it("debería devolver 404 si la entrega no existe", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(null);

      const res = await request(app).get("/api/deliveries/507f1f77bcf86cd799439016");

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  // POST /api/deliveries
  describe("POST /api/deliveries", () => {
    it("debería crear una entrega válida", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);
      deliveriesRepositorie.createDelivery.mockResolvedValue(mockDeliveryFromDB);

      const res = await request(app).post("/api/deliveries").send(validDelivery);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload._id).toBe(mockDeliveryFromDB._id);
      expect(res.body.payload.order).toBe(mockDeliveryFromDB.order);
    });

    it("debería devolver 400 si falta el pedido", async () => {
      const res = await request(app)
        .post("/api/deliveries")
        .send(deliveryWithoutOrder);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si falta el repartidor", async () => {
      const res = await request(app)
        .post("/api/deliveries")
        .send(deliveryWithoutDriver);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      ordersServices.getOrderById.mockResolvedValue(null);

      const res = await request(app).post("/api/deliveries").send(validDelivery);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 404 si el repartidor no existe", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(null);

      const res = await request(app).post("/api/deliveries").send(validDelivery);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si el usuario no tiene rol de repartidor", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockNonDriverUser);

      const res = await request(app).post("/api/deliveries").send(validDelivery);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 409 si el pedido ya fue asignado o procesado", async () => {
      ordersServices.getOrderById.mockResolvedValue(mockOrderNotCreated);
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);

      const res = await request(app).post("/api/deliveries").send(validDelivery);

      expect(res.status).toBe(409);
      expect(res.body.status).toBe("fail");
    });
  });

  // PATCH /api/deliveries/:did/status
  describe("PATCH /api/deliveries/:did/status", () => {
    it("debería actualizar el estado de una entrega existente", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue({
        ...mockDeliveryFromDB,
      });
      deliveriesRepositorie.updateDeliveryStatus.mockResolvedValue(
        mockUpdatedDelivery,
      );

      const res = await request(app)
        .patch(`/api/deliveries/${mockDeliveryFromDB._id}/status`)
        .send({ status: "in_transit" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.status).toBe("in_transit");
    });

    it("debería devolver 404 si la entrega no existe", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/deliveries/507f1f77bcf86cd799439016/status")
        .send({ status: "in_transit" });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 409 si la entrega ya fue completada", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(
        mockDeliveryDelivered,
      );

      const res = await request(app)
        .patch(`/api/deliveries/${mockDeliveryFromDB._id}/status`)
        .send({ status: "in_transit" });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe("fail");
    });
  });

  // DELETE /api/deliveries/:did
  describe("DELETE /api/deliveries/:did", () => {
    it("debería eliminar una entrega existente", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(mockDeliveryFromDB);
      deliveriesRepositorie.deleteDelivery.mockResolvedValue(mockDeliveryFromDB);

      const res = await request(app).delete(
        `/api/deliveries/${mockDeliveryFromDB._id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload._id).toBe(mockDeliveryFromDB._id);
    });

    it("debería devolver 404 si la entrega no existe", async () => {
      deliveriesRepositorie.getDeliveryById.mockResolvedValue(null);

      const res = await request(app).delete(
        "/api/deliveries/507f1f77bcf86cd799439016",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });
});
