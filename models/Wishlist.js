const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    user: {                                    // 🔥 "user" (singular)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    image: String,
    price: Number,
  },
  { timestamps: true }
);

// duplicate prevent
wishlistSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);