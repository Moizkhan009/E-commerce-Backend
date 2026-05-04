const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware")

const {
  toggleWishlist,
  getWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, toggleWishlist);
router.get("/get", protect, getWishlist);
router.get("/:productId", protect, checkWishlist);

module.exports = router;