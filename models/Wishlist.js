const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    users: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // snapshot (optional but pro)
    name: String,
    image: String,
    price: Number,
  },
  {
    timestamps: true,
  }
);

// 🔥 prevent duplicate (most important)
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);