import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Error Handling — Integration (Mocha/Chai/Supertest)", () => {
  // ─── Ruta inexistente ──
  describe("GET /api/nonexistent (ruta inexistente)", () => {
    it("debería devolver 404 con formato de error correcto", async () => {
      const res = await request(app).get("/api/ruta-que-no-existe");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "ROUTE_NOT_FOUND");
      expect(res.body).to.have.property("message", "La ruta solicitada no existe");
    });
  });

  // ─── Método no permitido en ruta existente ──
  describe("PATCH inexistente en ruta válida", () => {
    it("debería devolver 404 para PATCH /api/users (no existe)", async () => {
      const res = await request(app).patch("/api/users").send({ test: true });

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("error", "ROUTE_NOT_FOUND");
    });
  });

  // ─── Formato consistente del error ──
  describe("Formato de respuesta de error", () => {
    it("debería tener la estructura { status, error, message } en errores 4xx", async () => {
      const res = await request(app).get("/api/users/507f1f77bcf86cd799439011");

      expect(res.status).to.be.at.least(400).and.below(500);
      expect(res.body).to.have.all.keys("status", "error", "message");
      expect(res.body.status).to.equal("fail");
      expect(res.body.error).to.be.a("string").and.not.be.empty;
      expect(res.body.message).to.be.a("string").and.not.be.empty;
    });

    it("debería tener la estructura { status, error, message } en errores de validación", async () => {
      const res = await request(app)
        .post("/api/users")
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body).to.have.all.keys("status", "error", "message");
      expect(res.body.status).to.equal("fail");
      expect(res.body.error).to.equal("VALIDATION_ERROR");
    });
  });
});
