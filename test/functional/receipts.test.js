import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";

// Helper: crear buffer PDF de prueba
function createTestFile() {
  const pdfHeader = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n";
  return Buffer.from(pdfHeader);
}

// Helper: crear usuario de prueba
async function createTestUser() {
  const res = await request(app)
    .post("/api/users")
    .send({
      firstName: "Receipt",
      lastName: "Test",
      email: `receipt-${Date.now()}@test.com`,
      password: "123456",
      role: "customer",
    });
  return res.body.payload;
}

// Helper: crear pedido de prueba
async function createTestOrder(userId) {
  const res = await request(app)
    .post("/api/orders")
    .send({
      customer: userId,
      items: [{ name: "Test Item", quantity: 1, price: 1000 }],
      deliveryAddress: "Calle Falsa 123",
    });
  return res.body.payload.order;
}

describe("Receipts — Integration (Mocha/Chai/Supertest)", () => {
  describe("POST /api/receipts/:entityType/:entityId", () => {
    it("debería asociar un comprobante a un pedido", async () => {
      const testUser = await createTestUser();
      const testOrder = await createTestOrder(testUser._id);
      const fileBuffer = createTestFile();

      const res = await request(app)
        .post(`/api/receipts/orders/${testOrder._id}`)
        .attach("proof", fileBuffer, "comprobante.pdf");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.payload).to.have.property("documents").that.is.an("array");
      expect(res.body.payload.documents).to.have.lengthOf(1);
      expect(res.body.payload.documents[0]).to.have.property("name", "comprobante.pdf");
      expect(res.body.payload.documents[0]).to.have.property("type", "proof");
    });

    it("debería devolver 404 si la entidad no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const fileBuffer = createTestFile();

      const res = await request(app)
        .post(`/api/receipts/orders/${fakeId}`)
        .attach("proof", fileBuffer, "comprobante.pdf");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "ORDER_NOT_FOUND");
    });

    it("debería devolver 400 si el tipo de entidad no es válido", async () => {
      const testUser = await createTestUser();
      const testOrder = await createTestOrder(testUser._id);
      const fileBuffer = createTestFile();

      const res = await request(app)
        .post(`/api/receipts/invalid_entity/${testOrder._id}`)
        .attach("proof", fileBuffer, "comprobante.pdf");

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "VALIDATION_ERROR");
    });

    it("debería devolver 415 si el tipo de archivo no es permitido", async () => {
      const testUser = await createTestUser();
      const testOrder = await createTestOrder(testUser._id);
      const txtBuffer = Buffer.from("esto es un archivo de texto");

      const res = await request(app)
        .post(`/api/receipts/orders/${testOrder._id}`)
        .attach("proof", txtBuffer, "comprobante.txt");

      expect(res.status).to.equal(415);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "UNSUPPORTED_MEDIA_TYPE");
    });
  });
});
