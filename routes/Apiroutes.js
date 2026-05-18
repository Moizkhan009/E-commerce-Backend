const express = require("express");
// const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createOrder,
  getOrders,
  cancelOrder,
} = require("../controllers/orderController");
const auth = require("../middleware/authMiddleware");

// Import all controllers
const profileController = require("../controllers/profileController");
const addressController = require("../controllers/addressController");
const paymentController = require("../controllers/paymentController");
const wishlistController = require("../controllers/wishlistController");
const securityController = require("../controllers/securityController");
const router = express.Router();

//  PROFILE ROUTES 
router.get("/profile", protect, profileController.getProfile);
router.put("/profile", protect, profileController.updateProfile);

//  ADDRESS ROUTES 
router.get("/addresses", protect, addressController.getAddresses);
router.get("/addresses/:addressId", protect, addressController.getAddressById);
router.post("/addresses", protect, addressController.addAddress);
router.put("/addresses/:addressId", protect, addressController.updateAddress);
router.delete("/addresses/:addressId", protect, addressController.deleteAddress);
router.put("/addresses/:addressId/default", protect, addressController.setDefaultAddress);

//  PAYMENT ROUTES 
router.get("/payments", protect, paymentController.getPaymentMethods);
router.post("/payments", protect, paymentController.addPaymentMethod);
router.delete("/payments/:paymentId", protect, paymentController.deletePaymentMethod);
router.put("/payments/:paymentId/default", protect, paymentController.setDefaultPayment);

//  SECURITY ROUTES 
router.put("/security/change-password", protect, securityController.changePassword);
router.post("/security/logout", protect, securityController.logout);
router.delete("/security/delete-account", protect, securityController.deleteAccount);

// Public routes (no authentication needed)
router.post("/security/forgot-password", securityController.forgotPassword);
router.put("/security/reset-password/:token", securityController.resetPassword);
//ORDER ROUTES
// router.post("/", auth, createOrder);
// router.get("/", auth, getOrders);
// router.put("/:orderId/cancel", auth, cancelOrder);

module.exports = router;