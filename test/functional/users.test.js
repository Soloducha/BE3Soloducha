import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

// ── Helper: crear usuario de prueba con email único ──
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
  return { res, userData };
}

describe("Users — Integration (Mocha/Chai/Supertest)", () => {
  // ─── GET /api/users ───
  describe("GET /api/users", () => {
    it("debería devolver un array vacío cuando no hay usuarios", async () => {
      const res = await request(app).get("/api/users");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body).to.have.property("payload").that.is.an("array").that.is
        .empty; //el nivel de profesionalidad
    });

    it("debería devolver todos los usuarios creados", async () => {
      await createTestUser({ firstName: "Juan" });
      await createTestUser({ firstName: "Maria" });

      const res = await request(app).get("/api/users");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(2);
      expect(res.body.payload[0]).to.have.property("firstName");
      expect(res.body.payload[0]).to.have.property("email");
      expect(res.body.payload[0]).to.have.property("role");
    });
  });

  // ─── GET /api/users/:uid ───
  describe("GET /api/users/:uid", () => {
    it("debería devolver un usuario por su ID", async () => {
      const { res: createRes } = await createTestUser({ firstName: "Carlos" });
      const userId = createRes.body.payload._id;

      const res = await request(app).get(`/api/users/${userId}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("firstName", "Carlos");
      expect(res.body.payload).to.have.property("_id", userId);
      expect(res.body.payload).to.have.property("email");
      expect(res.body.payload).to.have.property("role");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const res = await request(app).get(`/api/users/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "USER_NOT_FOUND");
      expect(res.body).to.have.property("message").that.is.a("string");
    });
  });

  // ─── POST /api/users ───
  describe("POST /api/users", () => {
    it("debería crear un usuario válido y devolver 201", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          firstName: "Ana",
          lastName: "Garcia",
          email: `ana-${Date.now()}@test.com`,
          password: "secure123",
          role: "customer",
        });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("_id");
      expect(res.body.payload).to.have.property("firstName", "Ana");
      expect(res.body.payload).to.have.property("lastName", "Garcia");
      expect(res.body.payload).to.have.property("role", "customer");
    });

    it("debería devolver 400 si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({ firstName: "SoloNombre" });

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 403 si intentan crear un admin", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({
          firstName: "Admin",
          lastName: "User",
          email: `admin-${Date.now()}@test.com`,
          password: "123456",
          role: "admin",
        });

      expect(res.status).to.equal(403);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "FORBIDDEN");
    });

    it("debería devolver 409 si el email ya existe", async () => {
      const email = `dup-${Date.now()}@test.com`;
      await createTestUser({ email });

      const res = await request(app).post("/api/users").send({
        firstName: "Duplicate",
        lastName: "User",
        email,
        password: "123456",
        role: "customer",
      });

      expect(res.status).to.equal(409);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "CONFLICT");
    });
  });
});
