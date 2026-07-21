import mongoose from "mongoose";

import { USER_ROLES } from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "La contrasena es obligatoria"],
    },
    role: {
      type: String,
      enum: [
        USER_ROLES.ADMIN,
        USER_ROLES.CUSTOMER,
        USER_ROLES.DRIVER,
        USER_ROLES.STORE,
      ],
      default: USER_ROLES.CUSTOMER,
    },
    documents: {
      type: [
        {
          name: { type: String },
          reference: { type: String },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
