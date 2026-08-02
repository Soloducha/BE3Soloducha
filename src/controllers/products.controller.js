import productsService from "../services/products.services.js";
import { HTTP_STATUS } from "../constants/index.js";

class productsController {
  async getAllProducts(req, res, next) {
    try {
      const products = await productsService.getAllProducts();
      res.json({ status: HTTP_STATUS.SUCCESS, payload: products });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productsService.getProductById(req.params.pid);
      res.json({ status: HTTP_STATUS.SUCCESS, payload: product });
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const newProduct = await productsService.createProduct(req.body);
      res.status(201).json({ status: HTTP_STATUS.SUCCESS, payload: newProduct });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const updatedProduct = await productsService.updateProduct(
        req.params.pid,
        req.body,
      );
      res.json({ status: HTTP_STATUS.SUCCESS, payload: updatedProduct });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const deletedProduct = await productsService.deleteProduct(
        req.params.pid,
      );
      res.json({ status: HTTP_STATUS.SUCCESS, payload: deletedProduct });
    } catch (error) {
      next(error);
    }
  }
}
export default new productsController();
