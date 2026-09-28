//ORDER Schema {USER,PRODUCT,STATUS}

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    stripeSessionId:{
      type: String,
      required: true,
      unique: true, // enforces no duplicate orders for the same session at the DB level too
    },
    paymentStatus: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "paid", "failed"],
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "processing", "shipped", "delivered", "cancelled"],
        message: "{Value} is not a valid status",
      },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Order", orderSchema);
