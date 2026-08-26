import mongoose from "mongoose";

import { ORDER_PRIORITY, DELIVERY_STATUS } from "../constants/index.js";

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "El pedido es obligatorio"],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: [
        DELIVERY_STATUS.PENDING,
        DELIVERY_STATUS.ASSIGNED,
        DELIVERY_STATUS.INTRANSIT,
        DELIVERY_STATUS.DELIVERED,
      ],
      default: DELIVERY_STATUS.PENDING,
    },
    priority: {
      type: String,
      enum: [ORDER_PRIORITY.LOW, ORDER_PRIORITY.NORMAL, ORDER_PRIORITY.HIGH],
      default: ORDER_PRIORITY.NORMAL,
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
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

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
