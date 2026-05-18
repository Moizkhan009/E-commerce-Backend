const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

     category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", 
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
    },
    countInStock: {
   type: Number,
   required: true,
   default: 5
   },
sections: {
    hotDeal: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    topSelling: { type: Boolean, default: false },
    topRated: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
    featured: { type: Boolean, default: false }
  },
   salesCount: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);
