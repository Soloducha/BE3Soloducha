import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

describe("Swagger & Health — Integration (Mocha/Chai/Supertest)", () => {
  // ─── GET /api/health ──
  describe("GET /api/health", () => {
    it("debería devolver 200 con status ok", async () => {
      const res = await request(app).get("/api/health");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "ok");
      expect(res.body).to.have.property("timestamp");
    });
  });

  // ─── GET /api/docs (Swagger UI) ──
  describe("GET /api/docs", () => {
    it("debería devolver 200 con HTML de Swagger UI", async () => {
      const res = await request(app).get("/api/docs/");

      expect(res.status).to.equal(200);
      expect(res.headers["content-type"]).to.include("text/html");
      expect(res.text).to.include("swagger");
    });

    it("debería devolver HTML válido de Swagger UI", async () => {
      const res = await request(app).get("/api/docs/");

      expect(res.text).to.be.a("string").and.not.be.empty;
      expect(res.text.length).to.be.greaterThan(500);
    });
  });
});
