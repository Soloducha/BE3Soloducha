import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

// ── Helpers ──
async function createTestUser(overrides = {}) {
  const userData = {
    firstName: "Test",
    lastName: "User",
    email: `test-${Date.now()}@test.com`,
    password: "123456",
    role: "customer",
    ...overrides,
  };
  const res = await request(app).post("/api/users").send(userData);
  return res.body.payload;
}

async function createTestProduct(overrides = {}) {
  const productData = {
    name: "Producto de test",
    description: "producto apra testear",
    price: 250,
    stock: 50,
    category: "test",
    ...overrides,
  };
  const res = await request(app).post("/api/products").send(productData);
  return res.body.payload;
}

describe("Products — Integration (Mocha/Chai/Supertest)", () => {
  // ─── GET /api/products ───
  describe("GET /api/products", () => {
    it("debería devolver un array vacío cuando no hay productos", async () => {
      const res = await request(app).get("/api/products");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("payload").that.is.an("array").that.is
        .empty;
    });

    it("debería devolver todos los productos creados", async () => {
      await createTestProduct({ name: "Notebook" });
      await createTestProduct({ name: "Mouse" });

      const res = await request(app).get("/api/products");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(2);
    });
  });

  // ─── GET /api/products/:pid ──
  describe("GET /api/products/:pid", () => {
    it("debería devolver un producto por su ID", async () => {
      const product = await createTestProduct({ name: "Teclado" });

      const res = await request(app).get(`/api/products/${product._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("name", "Teclado");
      expect(res.body.payload).to.have.property("price");
      expect(res.body.payload).to.have.property("stock");
    });

    it("debería devolver 404 si el producto no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app).get(`/api/products/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "PRODUCT_NOT_FOUND");
    });
  });

  // ─── POST /api/products ──
  describe("POST /api/products", () => {
    it("debería crear un producto válido y devolver 201", async () => {
      const res = await request(app).post("/api/products").send({
        name: "Monitor",
        description: 'Monitor 24"',
        price: 150000,
        stock: 10,
        category: "electronics",
      });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id");
      expect(res.body.payload).to.have.property("name", "Monitor");
      expect(res.body.payload).to.have.property("price", 150000);
      expect(res.body.payload).to.have.property("status", "available");
    });

    it("debería devolver 400 si faltan name, price o stock", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ description: "Sin nombre" });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 400 si el precio es negativo", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Bad", price: -100, stock: 5 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 400 si el stock es negativo", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Bad", price: 100, stock: -1 });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería marcar status out_of_stock si stock es 0", async () => {
      const res = await request(app)
        .post("/api/products")
        .send({ name: "Agotado", price: 100, stock: 0 });

      expect(res.status).to.equal(201);
      expect(res.body.payload).to.have.property("status", "out_of_stock");
    });
  });
});
