import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        name: {
          type: String,
          required: true,
          match: [/^[A-Za-z\s]+$/, "Name must contain only letters and spaces"],
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 },
        image: { type: String },
      },
    ],

    total: { type: Number, required: true },

    address: { type: String, required: true },

    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    receiveDate: {
      type: Date,
      default: null,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;