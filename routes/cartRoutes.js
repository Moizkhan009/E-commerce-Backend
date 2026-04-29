const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware")

const { addToCart } = require("../controllers/cartController");

router.post("/", auth , addToCart);

module.exports = router;