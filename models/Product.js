const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true
    },

    brand: {
      type: String,
      required: true
    },

    image: {
      type: String, // emoji ya image URL dono ho sakta hai
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    originalPrice: {
      type: Number
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },

    badge: {
      type: String // e.g. Hot, New, Sale
    },

    badgeColor: {
      type: String // e.g. bg-red-500
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
