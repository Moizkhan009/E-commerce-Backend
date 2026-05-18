// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);

const mongoose = require("mongoose");

// Address sub-schema
const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    default: "India",
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  addressType: {
    type: String,
    enum: ["home", "work", "other"],
    default: "home",
  },
}, { timestamps: true });

// Payment Method sub-schema
const paymentMethodSchema = new mongoose.Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  cardHolderName: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  paymentType: {
    type: String,
    enum: ["credit", "debit", "upi", "netbanking"],
    required: true,
  },
  upiId: {
    type: String, // For UPI payments
  },
}, { timestamps: true });

// Order Item sub-schema
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

// Order sub-schema
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: addressSchema,
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  orderStatus: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveredDate: Date,
}, { timestamps: true });

// Main User Schema
const userSchema = new mongoose.Schema(
  {
    // Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    
    // Profile Picture (optional but good to have)
    profilePicture: {
      type: String,
      default: null,
    },
    
    // Phone Number
    phoneNumber: {
      type: String,
      trim: true,
    },
    
    // Address Section (multiple addresses)
    addresses: [addressSchema],
    
    // Payment Methods (multiple payment methods)
    paymentMethods: [paymentMethodSchema],
    
    // Orders Section (multiple orders)
    orders: [orderSchema],
    
    // Wishlist (array of product IDs)
    wishlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    }],
    
    // Password reset token for security
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
// User role (for authorization)
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
    
    // Last login tracking
    lastLogin: Date,
  },
  { timestamps: true }
);

// Virtual to get default address
userSchema.virtual("defaultAddress").get(function() {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
});

// Virtual to get default payment method
userSchema.virtual("defaultPaymentMethod").get(function() {
  return this.paymentMethods.find(pm => pm.isDefault) || this.paymentMethods[0];
});

// Method to add to wishlist
userSchema.methods.addToWishlist = function(productId) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove from wishlist
userSchema.methods.removeFromWishlist = function(productId) {
  this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
  return this.save();
};

module.exports = mongoose.model("User", userSchema);