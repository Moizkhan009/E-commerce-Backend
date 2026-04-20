const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware")

const { createOrder } = require("../controllers/orderController");


// Create Order
router.post("/createOrder", authMiddleware , createOrder);

module.exports = router;