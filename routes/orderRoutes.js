const express = require("express");
const router = express.Router();

const { createOrder } = require("../controllers/orderController");


// Create Order
router.post("/createOrder",createOrder);

module.exports = router;