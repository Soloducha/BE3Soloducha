import Product from "../models/product.model.js";

class productsRepositorie {
  async getAllProducts() {
    return await Product.find();
  }

  async paginated({ page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    return Product.find().skip(skip).limit(limit);
  }

  async countDocuments() {
    return Product.countDocuments();
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
    return Product.findByIdAndUpdate(pid, productData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteProduct(pid) {
    return Product.findByIdAndDelete(pid);
  }
}

export default new productsRepositorie();
