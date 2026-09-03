import User from "../models/user.model.js";
import { USER_ROLES } from "../constants/index.js";

class usersRepositorie {
  async getAllUsers() {
    return User.find();
  }

  async paginated({ page = 1, limit = 10 }) {
    let skip = (page - 1) * limit;
    return User.find().skip(skip).limit(limit);
  }

  async countDocuments() {
    return User.countDocuments();
  }

  async getUserById(uid) {
    return User.findById(uid);
  }

  async getUserByEmail(email) {
    return User.findOne({ email });
  }

  async createUser(userData) {
    const { firstName, lastName, email, password, role } = userData;
    return await User.create({
      firstName,
      lastName,
      email,
      password: password,
      role: role || USER_ROLES.CUSTOMER,
    });
  }

  async updateUser(uid, userData) {
    return User.findByIdAndUpdate(uid, userData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteUser(uid) {
    return User.findByIdAndDelete(uid);
  }
}

export default new usersRepositorie();
