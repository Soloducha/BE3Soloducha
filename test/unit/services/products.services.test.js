import { jest } from "@jest/globals";

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
const { default: productsService } =
  await import("../../../src/services/products.services.js");
const { AppError } = await import("../../../src/utils/errors.js");
const { PRODUCT_STATUS } = await import("../../../src/constants/index.js");
const {
  validProduct,
  productWithoutName,
  productWithoutPrice,
  productWithoutStock,
  productWithNegativePrice,
  productWithNegativeStock,
  productWithZeroStock,
  mockProductFromDB,
  mockUpdatedProduct,
} = await import("../../mocks/products.mock.js");

describe("Products Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // getAllProducts
  describe("getAllProducts", () => {
    it("debería devolver todos los productos", async () => {
      productsRepositorie.getAllProducts.mockResolvedValue([mockProductFromDB]);

      const result = await productsService.getAllProducts();

      expect(result).toEqual([mockProductFromDB]);
      expect(productsRepositorie.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });

  // getProductById
  describe("getProductById", () => {
    it("debería devolver un producto por ID", async () => {
      productsRepositorie.getProductById.mockResolvedValue(mockProductFromDB);

      const result = await productsService.getProductById(mockProductFromDB._id);

      expect(result).toEqual(mockProductFromDB);
      expect(productsRepositorie.getProductById).toHaveBeenCalledWith(
        mockProductFromDB._id,
      );
    });

    it("debería lanzar error si el producto no existe", async () => {
      productsRepositorie.getProductById.mockResolvedValue(null);

      await expect(
        productsService.getProductById("507f1f77bcf86cd799439012"),
      ).rejects.toThrow(AppError);
    });
  });

  // createProduct
  describe("createProduct", () => {
    it("debería crear un producto con estado AVAILABLE", async () => {
      productsRepositorie.createProduct.mockResolvedValue(mockProductFromDB);

      const result = await productsService.createProduct(validProduct);

      expect(result).toEqual(mockProductFromDB);
      expect(productsRepositorie.createProduct).toHaveBeenCalledWith({
        ...validProduct,
        status: PRODUCT_STATUS.AVAILABLE,
      });
    });

    it("debería crear un producto con estado OUT_OF_STOCK si el stock es 0", async () => {
      productsRepositorie.createProduct.mockResolvedValue({
        ...mockProductFromDB,
        stock: 0,
        status: PRODUCT_STATUS.OUT_OF_STOCK,
      });

      const result = await productsService.createProduct(productWithZeroStock);

      expect(productsRepositorie.createProduct).toHaveBeenCalledWith({
        ...productWithZeroStock,
        status: PRODUCT_STATUS.OUT_OF_STOCK,
      });
      expect(result.status).toBe(PRODUCT_STATUS.OUT_OF_STOCK);
    });

    it("debería lanzar error si falta el nombre", async () => {
      await expect(
        productsService.createProduct(productWithoutName),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si falta el precio", async () => {
      await expect(
        productsService.createProduct(productWithoutPrice),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si falta el stock", async () => {
      await expect(
        productsService.createProduct(productWithoutStock),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el precio es negativo", async () => {
      await expect(
        productsService.createProduct(productWithNegativePrice),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el stock es negativo", async () => {
      await expect(
        productsService.createProduct(productWithNegativeStock),
      ).rejects.toThrow(AppError);
    });
  });

  // updateProduct
  describe("updateProduct", () => {
    it("debería actualizar un producto existente", async () => {
      productsRepositorie.getProductById.mockResolvedValue({
        ...mockProductFromDB,
      });
      productsRepositorie.updateProduct.mockResolvedValue(mockUpdatedProduct);

      const result = await productsService.updateProduct(mockProductFromDB._id, {
        price: 1800,
      });

      expect(result).toEqual(mockUpdatedProduct);
      expect(productsRepositorie.updateProduct).toHaveBeenCalledWith(
        mockProductFromDB._id,
        { ...mockProductFromDB, price: 1800 },
      );
    });

    it("debería lanzar error si el producto no existe", async () => {
      productsRepositorie.getProductById.mockResolvedValue(null);

      await expect(
        productsService.updateProduct("507f1f77bcf86cd799439012", {
          price: 1800,
        }),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el precio es negativo", async () => {
      productsRepositorie.getProductById.mockResolvedValue({
        ...mockProductFromDB,
      });

      await expect(
        productsService.updateProduct(mockProductFromDB._id, {
          price: -100,
        }),
      ).rejects.toThrow(AppError);
    });

    it("debería lanzar error si el stock es negativo", async () => {
      productsRepositorie.getProductById.mockResolvedValue({
        ...mockProductFromDB,
      });

      await expect(
        productsService.updateProduct(mockProductFromDB._id, {
          stock: -5,
        }),
      ).rejects.toThrow(AppError);
    });

    it("debería recalcular el estado al cambiar el stock a 0", async () => {
      productsRepositorie.getProductById.mockResolvedValue({
        ...mockProductFromDB,
      });

      await productsService.updateProduct(mockProductFromDB._id, { stock: 0 });

      expect(productsRepositorie.updateProduct).toHaveBeenCalledWith(
        mockProductFromDB._id,
        {
          ...mockProductFromDB,
          stock: 0,
          status: PRODUCT_STATUS.OUT_OF_STOCK,
        },
      );
    });
  });

  // deleteProduct
  describe("deleteProduct", () => {
    it("debería eliminar un producto existente", async () => {
      productsRepositorie.getProductById.mockResolvedValue(mockProductFromDB);
      productsRepositorie.deleteProduct.mockResolvedValue(mockProductFromDB);

      const result = await productsService.deleteProduct(mockProductFromDB._id);

      expect(result).toEqual(mockProductFromDB);
      expect(productsRepositorie.deleteProduct).toHaveBeenCalledWith(
        mockProductFromDB._id,
      );
    });

    it("debería lanzar error si el producto no existe", async () => {
      productsRepositorie.getProductById.mockResolvedValue(null);

      await expect(
        productsService.deleteProduct("507f1f77bcf86cd799439012"),
      ).rejects.toThrow(AppError);
    });
  });
});
