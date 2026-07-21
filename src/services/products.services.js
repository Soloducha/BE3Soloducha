import productsRepositorie from "../repositories/products.repositories.js";
import PRODUCT_STATUS from "../constants/productStatus.js";

class productsService {
  async getAllProducts() {
    return productsRepositorie.getAllProducts();
  }

  async getProductById(pid) {
    const product = await productsRepositorie.getProductById(pid);
    if (!product) {
      throw new Error("Producto no encontrado", 404);
    }
    return product;
  }

  async createProduct(productData) {
    const { name, description, price, stock, category, status } = ProductData;

    if (!name || price === undefined || stock === undefined) {
      throw new Error("Faltan datos obligatorios (name, price, stock)", 400);
    }

    if (price < 0) {
      throw new Error("El precio no puede ser negativo", 400);
    }

    if (stock < 0) {
      throw new Error("El stock no puede ser negativo", 400);
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
      throw new Error("Producto no encontrado", 404);
    }

    const { name, description, price, stock, category, status } = productData;

    if (price !== undefined && price < 0) {
      throw new Error("El precio no puede ser negativo", 400);
    }

    if (stock !== undefined && stock < 0) {
      throw new Error("El stock no puede ser negativo", 400);
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
      throw new Error("Producto no encontrado", 404);
    }
    const deletedProduct = await productsRepositorie.deleteProduct(pid);
    return deletedProduct;
  }
}
export default new productsService();
