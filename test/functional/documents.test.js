import { expect } from "chai";
import request from "supertest";
import app from "../../src/app.js";
import fs from "fs";
import path from "path";

// Helper: crear un buffer de prueba que simule un archivo PDF
function createTestFile() {
  // Minimal valid PDF header
  const pdfHeader = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n";
  return Buffer.from(pdfHeader);
}

// Helper: crear usuario de prueba
async function createTestUser() {
  const userData = {
    firstName: "DocTest",
    lastName: "User",
    email: `doctest-${Date.now()}@test.com`,
    password: "123456",
    role: "customer",
  };
  const res = await request(app).post("/api/users").send(userData);
  return res.body.payload;
}

describe("Documents — Integration (Mocha/Chai/Supertest)", () => {
  describe("POST /api/documents/:uid/documents", () => {
    it("debería subir un documento correctamente", async () => {
      const testUser = await createTestUser();
      const fileBuffer = createTestFile();

      const res = await request(app)
        .post(`/api/documents/${testUser._id}/documents`)
        .field("type", "document")
        .attach("document", fileBuffer, "test-document.pdf");

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property("status", "success");
      expect(res.body.payload).to.have.property("documents").that.is.an("array");
      expect(res.body.payload.documents).to.have.lengthOf(1);
      expect(res.body.payload.documents[0]).to.have.property("name", "test-document.pdf");
      expect(res.body.payload.documents[0]).to.have.property("type", "document");
      expect(res.body.payload.documents[0]).to.have.property("mimetype", "application/pdf");
      expect(res.body.payload.documents[0]).to.have.property("size");
      expect(res.body.payload.documents[0]).to.have.property("uploadedAt");
    });

    it("debería devolver 404 si el usuario no existe", async () => {
      const fakeId = "507f1f77bcf86cd799439011";
      const fileBuffer = createTestFile();

      const res = await request(app)
        .post(`/api/documents/${fakeId}/documents`)
        .field("type", "document")
        .attach("document", fileBuffer, "test.pdf");

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "USER_NOT_FOUND");
    });

    it("debería devolver 400 si el tipo de documento es inválido", async () => {
      const testUser = await createTestUser();
      const fileBuffer = createTestFile();

      const res = await request(app)
        .post(`/api/documents/${testUser._id}/documents`)
        .field("type", "invalid_type")
        .attach("document", fileBuffer, "test.pdf");

      expect(res.status).to.equal(400);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "INVALID_DOCUMENT_TYPE");
    });

    it("debería devolver 415 si el tipo de archivo no es permitido", async () => {
      const testUser = await createTestUser();
      const txtBuffer = Buffer.from("esto es un archivo de texto");

      const res = await request(app)
        .post(`/api/documents/${testUser._id}/documents`)
        .field("type", "document")
        .attach("document", txtBuffer, "test.txt");

      expect(res.status).to.equal(415);
      expect(res.body).to.have.property("status", "fail");
      expect(res.body).to.have.property("error", "UNSUPPORTED_MEDIA_TYPE");
    });
  });
});
