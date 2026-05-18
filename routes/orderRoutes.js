// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware")

// const { createOrder } = require("../controllers/orderController");


// // Create Order
// router.post("/", authMiddleware , createOrder);

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const {
  createOrder,
  getOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,

} = require("../controllers/orderController");

router.get('/admin/orders', auth, admin, getAllOrders);
router.post("/", auth, createOrder);
router.get("/", auth, getOrders);
router.put("/admin/orders/:orderId", auth, admin, updateOrderStatus);
// router.delete("/admin/orders/:orderId", protect, admin,deleteOrder);
router.put("/:orderId/cancel", auth, cancelOrder);

module.exports = router;