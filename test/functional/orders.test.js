import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

// ── Helpers ──
async function createTestUser(overrides = {}) {
  const userData = {
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@test.com`,
    password: "123466",
    role: "customer",
    ...overrides,
  };
  const res = await request(app).post("/api/users").send(userData);
  return res.body.payload;
}

async function createTestOrder(customerId, overrides = {}) {
  const orderData = {
    customer: customerId,
    items: [{ name: "Test Item", price: 100, quantity: 2 }],
    deliveryAddress: "123 Test St, Test City",
    ...overrides,
  };
  const res = await request(app).post("/api/orders").send(orderData);
  // La respuesta de createOrder devuelve { order, shippingCost, message }
  return res.body.payload.order;
}

describe("Orders — Integration (Mocha/Chai/Supertest)", () => {
  // ─── GET /api/orders ───
  describe("GET /api/orders", () => {
    it("debería devolver un array vacío cuando no hay pedidos", async () => {
      const res = await request(app).get("/api/orders");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("payload").that.is.an("array").that.is.empty;
    });

    it("debería devolver los pedidos creados", async () => {
      const user = await createTestUser();
      await createTestOrder(user._id);
      await createTestOrder(user._id);

      const res = await request(app).get("/api/orders");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(2);
    });
  });

  // ─── GET /api/orders/:oid ──
  describe("GET /api/orders/:oid", () => {
    it("debería devolver un pedido por su ID", async () => {
      const user = await createTestUser();
      const order = await createTestOrder(user._id);

      const res = await request(app).get(`/api/orders/${order._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id", order._id);
      expect(res.body.payload).to.have.property("status");
      expect(res.body.payload).to.have.property("total");
      expect(res.body.payload).to.have.property("items").that.is.an("array");
      expect(res.body.payload).to.have.property("deliveryAddress");
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app).get(`/api/orders/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "ORDER_NOT_FOUND");
    });
  });

  // ─── POST /api/orders ──
  describe("POST /api/orders", () => {
    it("debería crear un pedido válido con datos correctos", async () => {
      const user = await createTestUser();

      const res = await request(app)
        .post("/api/orders")
        .send({
          customer: user._id,
          items: [
            { name: "Product A", price: 500, quantity: 2 },
            { name: "Product B", price: 300, quantity: 1 },
          ],
          deliveryAddress: "Av. Scaloneta 1234, CABA",
        });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("order").that.is.an("object");
      expect(res.body.payload).to.have.property("shippingCost");
      expect(res.body.payload).to.have.property("message");
      expect(res.body.payload.order).to.have.property("_id");
      expect(res.body.payload.order).to.have.property("total", 1300);
      expect(res.body.payload.order).to.have.property("status", "created");
    });

    it("debería devolver 400 si falta el cliente (customer)", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send({
          items: [{ name: "A", price: 100, quantity: 1 }],
          deliveryAddress: "Test",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 400 si no hay items", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/api/orders")
        .send({
          customer: user._id,
          items: [],
          deliveryAddress: "Test",
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 400 si falta la dirección", async () => {
      const user = await createTestUser();
      const res = await request(app)
        .post("/api/orders")
        .send({
          customer: user._id,
          items: [{ name: "A", price: 100, quantity: 1 }],
        });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 404 si el customer no existe en la DB", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .post("/api/orders")
        .send({
          customer: fakeId,
          items: [{ name: "A", price: 100, quantity: 1 }],
          deliveryAddress: "Test",
        });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "USER_NOT_FOUND");
    });
  });

  // ─── PATCH /api/orders/:oid/status ──
  describe("PATCH /api/orders/:oid/status", () => {
    it("debería actualizar el estado de un pedido", async () => {
      const user = await createTestUser();
      const order = await createTestOrder(user._id);

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "in_transit" });

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("status", "in_transit");
    });

    it("debería devolver 400 si falta el status", async () => {
      const user = await createTestUser();
      const order = await createTestOrder(user._id);

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app)
        .patch(`/api/orders/${fakeId}/status`)
        .send({ status: "in_progress" });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "ORDER_NOT_FOUND");
    });

    it("debería devolver 409 si el pedido ya fue entregado", async () => {
      const user = await createTestUser();
      const order = await createTestOrder(user._id);

      // Primero marcar como entregado
      await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "delivered" });

      // Intentar cambiar después de entregado
      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "in_progress" });

      expect(res.status).to.equal(409);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "CONFLICT");
    });

    it("debería devolver 400 si se intenta reiniciar con status 'created'", async () => {
      const user = await createTestUser();
      const order = await createTestOrder(user._id);

      const res = await request(app)
        .patch(`/api/orders/${order._id}/status`)
        .send({ status: "created" });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });
  });

  // ─── DELETE /api/orders/:oid ──
  describe("DELETE /api/orders/:oid", () => {
    it("debería eliminar un pedido existente", async () => {
      const user = await createTestUser();
      const order = await createTestOrder(user._id);

      const res = await request(app).delete(`/api/orders/${order._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("message");

      // Verificar que ya no existe
      const getRes = await request(app).get(`/api/orders/${order._id}`);
      expect(getRes.status).to.equal(404);
    });

    it("debería devolver 404 si el pedido no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app).delete(`/api/orders/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "ORDER_NOT_FOUND");
    });
  });
});
