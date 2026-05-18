const express = require("express");
const { registerUser, loginUser ,getAllCustomers } = require("../controllers/userController");
const {addProduct} = require("../controllers/productsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/customers", getAllCustomers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/products', addProduct);




router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});



module.exports = router;
