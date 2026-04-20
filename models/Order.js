const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    country: { type: String, default: "Pakistan" },
  },
  { _id: false }
);

const paymentResultSchema = new mongoose.Schema(
  {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: shippingAddressSchema,

    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Card", "JazzCash", "EasyPaisa"],
    },

    paymentResult: paymentResultSchema,

    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    isPaid: { type: Boolean, required: true, default: false },
    paidAt: Date,

    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: Date,

    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);