import mongoose from "mongoose";
import { ORDER_STATUS, ORDER_PRIORITY } from "../constants/index.js";
const orderItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del item es obligatorio"],
    },
    quantity: {
      type: Number,
      required: [true, "La cantidad es obligatoria"],
      min: [1, "La cantidad minima es 1"],
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El cliente es obligatorio"],
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "El pedido debe tener al menos un item",
      },
    },
    deliveryAddress: {
      type: String,
      required: [true, "La direccion de entrega es obligatoria"],
    },
    total: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: [
        ORDER_STATUS.CREATED,
        ORDER_STATUS.ASSIGNED,
        ORDER_STATUS.PICKEDUP,
        ORDER_STATUS.INTRANSIT,
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED,
      ],
      default: ORDER_STATUS.CREATED,
    },
    priority: {
      type: String,
      enum: [ORDER_PRIORITY.LOW, ORDER_PRIORITY.NORMAL, ORDER_PRIORITY.HIGH],
      default: ORDER_PRIORITY.NORMAL,
    },
    delivery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Delivery",
      default: null,
    },
    documents: {
      type: [
        {
          name: { type: String },
          reference: { type: String },
          type: { type: String },
          mimetype: { type: String },
          size: { type: Number },
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
