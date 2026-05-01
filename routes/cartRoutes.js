const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware")
const { getCart } = require("../controllers/cartController");

const { addToCart } = require("../controllers/cartController");
const { updateCartItem } = require("../controllers/cartController");
const { removeFromCart } = require("../controllers/cartController");

router.post("/", auth , addToCart);
router.get("/", auth, getCart);
router.put("/",    auth, updateCartItem); // PUT    /api/cart  ← YEH NAHI THA
router.delete("/", auth, removeFromCart); // DELETE /api/cart  ← YEH NAHI THA

module.exports = router;