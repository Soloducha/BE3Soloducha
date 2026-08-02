import { jest } from "@jest/globals";
import request from "supertest";

// Simula los módulos de los repositorios
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

// Importo todo lo que dependa de los módulos simulados
const { default: ordersRepositorie } =
  await import("../../../src/repositories/orders.repositories.js");
const { default: usersRepositorie } =
  await import("../../../src/repositories/users.repositories.js");
const { default: app } = await import("../../../src/app.js");
const {
  validOrder,
  orderWithoutCustomer,
  orderWithoutItems,
  orderWithoutDeliveryAddress,
  mockCustomerUser,
  mockDriverUser,
  mockOrderFromDB,
  mockUpdatedOrder,
} = await import("../../mocks/orders.mock.js");

describe("Orders Routes - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/orders
  describe("GET /api/orders", () => {
    it("debería devolver todos los pedidos", async () => {
      ordersRepositorie.getAllOrders.mockResolvedValue([mockOrderFromDB]);

      const res = await request(app).get("/api/orders");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(1);
      expect(res.body.payload[0].total).toBe(5000);
    });
  });

  // GET /api/orders/:oid
  describe("GET /api/orders/:oid", () => {
    it("debería devolver un pedido por ID", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);

      const res = await request(app).get(`/api/orders/${mockOrderFromDB._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.total).toBe(5000);
      expect(res.body.payload.customer).toBe(mockOrderFromDB.customer);
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(null);

      const res = await request(app).get("/api/orders/507f1f77bcf86cd799439015");

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  // POST /api/orders
  describe("POST /api/orders", () => {
    it("debería crear un pedido válido", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockCustomerUser);
      ordersRepositorie.createOrder.mockResolvedValue(mockOrderFromDB);

      const res = await request(app).post("/api/orders").send(validOrder);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.order._id).toBe(mockOrderFromDB._id);
      expect(res.body.payload.shippingCost).toBe(30);
      expect(res.body.payload.message).toBe("Pedido creado y email enviado");
    });

    it("debería devolver 400 si falta el cliente", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send(orderWithoutCustomer);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si faltan los items", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send(orderWithoutItems);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si falta la dirección", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send(orderWithoutDeliveryAddress);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      usersRepositorie.getUserById.mockResolvedValue(null);

      const res = await request(app).post("/api/orders").send(validOrder);

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 403 si el usuario es repartidor", async () => {
      usersRepositorie.getUserById.mockResolvedValue(mockDriverUser);

      const res = await request(app).post("/api/orders").send(validOrder);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("fail");
    });
  });

  // PATCH /api/orders/:oid/status
  describe("PATCH /api/orders/:oid/status", () => {
    it("debería actualizar el estado de un pedido existente", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);
      ordersRepositorie.updateOrderStatus.mockResolvedValue(mockUpdatedOrder);

      const res = await request(app)
        .patch(`/api/orders/${mockOrderFromDB._id}/status`)
        .send({ status: "in_transit" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.status).toBe("in_transit");
    });

    it("debería devolver 400 si falta el estado", async () => {
      const res = await request(app)
        .patch(`/api/orders/${mockOrderFromDB._id}/status`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(null);

      const res = await request(app)
        .patch("/api/orders/507f1f77bcf86cd799439015/status")
        .send({ status: "in_transit" });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 409 si el pedido ya fue entregado", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue({
        ...mockOrderFromDB,
        status: "delivered",
      });

      const res = await request(app)
        .patch(`/api/orders/${mockOrderFromDB._id}/status`)
        .send({ status: "in_transit" });

      expect(res.status).toBe(409);
      expect(res.body.status).toBe("fail");
    });
  });

  // DELETE /api/orders/:oid
  describe("DELETE /api/orders/:oid", () => {
    it("debería eliminar un pedido existente", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(mockOrderFromDB);
      ordersRepositorie.deleteOrder.mockResolvedValue(mockOrderFromDB);

      const res = await request(app).delete(`/api/orders/${mockOrderFromDB._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.message).toBe("Pedido eliminado correctamente");
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      ordersRepositorie.getOrderById.mockResolvedValue(null);

      const res = await request(app).delete(
        "/api/orders/507f1f77bcf86cd799439015",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });
});
