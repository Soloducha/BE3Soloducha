import { jest } from "@jest/globals";
import request from "supertest";

// Simula el módulo del repositorio
jest.unstable_mockModule(
  "../../../src/repositories/products.repositories.js",
  () => ({
    default: {
      getAllProducts: jest.fn(),
      getProductById: jest.fn(),
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
    },
  }),
);

// Importo todo lo que dependa del módulo simulado
const { default: productsRepositorie } =
  await import("../../../src/repositories/products.repositories.js");
const { default: app } = await import("../../../src/app.js");
const {
  validProduct,
  productWithoutName,
  productWithNegativePrice,
  productWithNegativeStock,
  mockProductFromDB,
  mockUpdatedProduct,
} = await import("../../mocks/products.mock.js");

describe("Products Routes - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET /api/products
  describe("GET /api/products", () => {
    it("debería devolver todos los productos", async () => {
      productsRepositorie.getAllProducts.mockResolvedValue([mockProductFromDB]);

      const res = await request(app).get("/api/products");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload).toHaveLength(1);
      expect(res.body.payload[0].name).toBe("Camiseta Deportiva");
    });
  });

  // GET /api/products/:pid
  describe("GET /api/products/:pid", () => {
    it("debería devolver un producto por ID", async () => {
      productsRepositorie.getProductById.mockResolvedValue(mockProductFromDB);

      const res = await request(app).get(`/api/products/${mockProductFromDB._id}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.name).toBe("Camiseta Deportiva");
      expect(res.body.payload.price).toBe(1500);
    });

    it("debería devolver 404 si el producto no existe", async () => {
      productsRepositorie.getProductById.mockResolvedValue(null);

      const res = await request(app).get("/api/products/507f1f77bcf86cd799439012");

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });

  // POST /api/products
  describe("POST /api/products", () => {
    it("debería crear un producto válido", async () => {
      productsRepositorie.createProduct.mockResolvedValue(mockProductFromDB);

      const res = await request(app).post("/api/products").send(validProduct);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.name).toBe("Camiseta Deportiva");
    });

    it("debería devolver 400 si faltan campos obligatorios", async () => {
      const res = await request(app)
        .post("/api/products")
        .send(productWithoutName);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si el precio es negativo", async () => {
      const res = await request(app)
        .post("/api/products")
        .send(productWithNegativePrice);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si el stock es negativo", async () => {
      const res = await request(app)
        .post("/api/products")
        .send(productWithNegativeStock);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  // PUT /api/products/:pid
  describe("PUT /api/products/:pid", () => {
    it("debería actualizar un producto existente", async () => {
      productsRepositorie.getProductById.mockResolvedValue({
        ...mockProductFromDB,
      });
      productsRepositorie.updateProduct.mockResolvedValue(mockUpdatedProduct);

      const res = await request(app)
        .put(`/api/products/${mockProductFromDB._id}`)
        .send({ price: 1800 });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.price).toBe(1800);
    });

    it("debería devolver 404 si el producto no existe", async () => {
      productsRepositorie.getProductById.mockResolvedValue(null);

      const res = await request(app)
        .put("/api/products/507f1f77bcf86cd799439012")
        .send({ price: 1800 });

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });

    it("debería devolver 400 si el precio es negativo", async () => {
      productsRepositorie.getProductById.mockResolvedValue({
        ...mockProductFromDB,
      });

      const res = await request(app)
        .put(`/api/products/${mockProductFromDB._id}`)
        .send({ price: -100 });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });
  });

  // DELETE /api/products/:pid
  describe("DELETE /api/products/:pid", () => {
    it("debería eliminar un producto existente", async () => {
      productsRepositorie.getProductById.mockResolvedValue(mockProductFromDB);
      productsRepositorie.deleteProduct.mockResolvedValue(mockProductFromDB);

      const res = await request(app).delete(
        `/api/products/${mockProductFromDB._id}`,
      );

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.payload.name).toBe("Camiseta Deportiva");
    });

    it("debería devolver 404 si el producto no existe", async () => {
      productsRepositorie.getProductById.mockResolvedValue(null);

      const res = await request(app).delete(
        "/api/products/507f1f77bcf86cd799439012",
      );

      expect(res.status).toBe(404);
      expect(res.body.status).toBe("fail");
    });
  });
});
