import mongoose from "mongoose";
import config from "../src/config/index.js";
import User from "../src/models/user.model.js";
import Product from "../src/models/product.model.js";
import Order from "../src/models/order.model.js";
import Delivery from "../src/models/delivery.model.js";

before(async function () {
  this.timeout(15000);
  await mongoose.connect(config.mongoUri);
});

beforeEach(async () => {
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Delivery.deleteMany({});
});

after(async function () {
  this.timeout(10000);
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});
  await Delivery.deleteMany({});
  await mongoose.disconnect();
});
