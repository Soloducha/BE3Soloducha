import productsRepositorie from "../repositories/products.repositories.js";
import { PRODUCT_STATUS } from "../constants/index.js";
import { AppError } from "../utils/errors.js";
import { ERROR_CODES } from "../constants/error.codes.js";

class productsService {
  async getAllProducts() {
    return productsRepositorie.getAllProducts();
  }

  async paginated({ page = 1, limit = 10 }) {
    const currentPage = Number(page);
    const currentLimit = Number(limit);
    const result = await productsRepositorie.paginated({
      page: currentPage,
      limit: currentLimit,
    });
    const totalDocuments = await productsRepositorie.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    return {
      docs: result,
      count: result.length,
      total: totalDocuments,
      totalPages,
      page: currentPage,
      hasPreviousPage: currentPage > 1,
      hasNextPages: currentPage < totalPages,
      prevLink:
        currentPage > 1
          ? `/api/products?page=${currentPage - 1}&limit=${currentLimit}`
          : null,
      nextLink:
        currentPage < totalPages
          ? `/api/products?page=${currentPage + 1}&limit=${currentLimit}`
          : null,
    };
  }

  async getProductById(pid) {
    const product = await productsRepositorie.getProductById(pid);
    if (!product) {
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND, "Producto no encontrado");
    }
    return product;
  }

  async createProduct(productData) {
    const { name, description, price, stock, category, status } = productData;

    if (!name || price === undefined || stock === undefined) {
      throw new AppError(
        ERROR_CODES.VALIDATION_ERROR,
        "Faltan datos obligatorios (name, price, stock)",
      );
    }

    if (price < 0) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "El precio no puede ser negativo");
    }

    if (stock < 0) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "El stock no puede ser negativo");
    }

    const newProduct = await productsRepositorie.createProduct({
      name,
      description,
      price,
      stock,
      category,
      status:
        stock > 0
          ? status || PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK,
    });

    return newProduct;
  }

  async updateProduct(pid, productData) {
    const product = await productsRepositorie.getProductById(pid);
    if (!product) {
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND, "Producto no encontrado");
    }

    const { name, description, price, stock, category, status } = productData;

    if (price !== undefined && price < 0) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "El precio no puede ser negativo");
    }

    if (stock !== undefined && stock < 0) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, "El stock no puede ser negativo");
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) {
      product.stock = stock;
      product.status =
        stock > 0
          ? status || PRODUCT_STATUS.AVAILABLE
          : PRODUCT_STATUS.OUT_OF_STOCK;
    }
    if (category !== undefined) product.category = category;
    if (status !== undefined && product.stock > 0) product.status = status;

    const updatedProduct = await productsRepositorie.updateProduct(
      pid,
      product,
    );

    return updatedProduct;
  }

  async deleteProduct(pid) {
    const product = await productsRepositorie.getProductById(pid);
    if (!product) {
      throw new AppError(ERROR_CODES.PRODUCT_NOT_FOUND, "Producto no encontrado");
    }
    const deletedProduct = await productsRepositorie.deleteProduct(pid);
    return deletedProduct;
  }
}
export default new productsService();
