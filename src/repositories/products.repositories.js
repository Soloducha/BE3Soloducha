import Product from "../models/product.model.js";

class productsRepositorie {
  async getAllProducts() {
    return await Product.find();
  }

  async getProductById(pid) {
    return await Product.findById(pid);
  }

  async createProduct(productData) {
    const { name, description, price, stock, category, status } = productData;

    return await Product.create({
      name,
      description,
      price,
      stock,
      category,
      status,
    });
  }

  async updateProduct(pid, productData) {
    return Product.findByIdAndUpdate(pid, productData, { new: true });
  }

  async deleteProduct(pid) {
    return Product.findByIdAndDelete(pid);
  }
}

export default new productsRepositorie();
