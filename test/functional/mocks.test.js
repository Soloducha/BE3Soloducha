import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Mocks — Integration (Mocha/Chai/Supertest)", () => {
  // ─── GET /api/mocks/users ──
  describe("GET /api/mocks/users", () => {
    it("debería generar 10 usuarios mock por defecto", async () => {
      const res = await request(app).get("/api/mocks/users");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("payload").that.is.an("array").with.lengthOf(10);
      expect(res.body).to.have.property("total", 10);
      expect(res.body.payload[0]).to.have.property("firstName");
      expect(res.body.payload[0]).to.have.property("lastName");
      expect(res.body.payload[0]).to.have.property("email");
      expect(res.body.payload[0]).to.have.property("role");
    });

    it("debería generar la cantidad indicada con ?count=3", async () => {
      const res = await request(app).get("/api/mocks/users?count=3");

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.be.an("array").with.lengthOf(3);
      expect(res.body.total).to.equal(3);
    });

    it("debería devolver 400 si count es 0", async () => {
      const res = await request(app).get("/api/mocks/users?count=0");

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "INVALID_MOCK_AMOUNT");
    });

    it("debería devolver 400 si count no es un número válido", async () => {
      const res = await request(app).get("/api/mocks/users?count=abc");

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "INVALID_MOCK_AMOUNT");
    });

    it("debería devolver 400 si count es mayor a 100", async () => {
      const res = await request(app).get("/api/mocks/users?count=101");

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("error", "INVALID_MOCK_AMOUNT");
    });
  });

  // ─── GET /api/mocks/products ──
  describe("GET /api/mocks/products", () => {
    it("debería generar productos mock sin persistir", async () => {
      const res = await request(app).get("/api/mocks/products");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(10);
      expect(res.body.payload[0]).to.have.property("name");
      expect(res.body.payload[0]).to.have.property("price");
      expect(res.body.payload[0]).to.have.property("stock");
      expect(res.body.payload[0]).to.have.property("category");
    });
  });

  // ─── POST /api/mocks/users (persiste en DB) ──
  describe("POST /api/mocks/users", () => {
    it("debería crear e insertar 5 usuarios en la DB", async () => {
      const res = await request(app)
        .post("/api/mocks/users")
        .send({ count: 5 });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(5);
      expect(res.body.total).to.equal(5);
      expect(res.body.payload[0]).to.have.property("_id");

      // Verificar que persistieron
      const listRes = await request(app).get("/api/users");
      expect(listRes.body.payload).to.be.an("array").with.lengthOf(5);
    });
  });

  // ─── POST /api/mocks/products (persiste en DB) ──
  describe("POST /api/mocks/products", () => {
    it("debería crear e insertar productos en la DB", async () => {
      const res = await request(app)
        .post("/api/mocks/products")
        .send({ count: 3 });

      expect(res.status).to.equal(201);
      expect(res.body.payload).to.be.an("array").with.lengthOf(3);

      // Verificar que persistieron
      const listRes = await request(app).get("/api/products");
      expect(listRes.body.payload).to.be.an("array").with.lengthOf(3);
    });
  });

  // ─── GET /api/mocks/orders (requiere usuarios existentes) ──
  describe("GET /api/mocks/orders", () => {
    it("debería devolver 400 si no hay usuarios en la DB", async () => {
      const res = await request(app).get("/api/mocks/orders");

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "MOCK_SOURCE_EMPTY");
    });

    it("debería generar pedidos mock cuando hay usuarios", async () => {
      // Insertar usuarios primero
      await request(app)
        .post("/api/mocks/users")
        .send({ count: 2 });

      const res = await request(app).get("/api/mocks/orders");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array");
      expect(res.body.payload[0]).to.have.property("customer");
      expect(res.body.payload[0]).to.have.property("items").that.is.an("array");
      expect(res.body.payload[0]).to.have.property("deliveryAddress");
    });
  });

  // ─── GET /api/mocks/logger ──
  describe("GET /api/mocks/logger", () => {
    it("debería generar logs y devolver 200", async () => {
      const res = await request(app).get("/api/mocks/logger");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("message").that.includes("Logs generados");
    });
  });
});
