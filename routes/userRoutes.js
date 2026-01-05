const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const {addProduct} = require("../controllers/productsController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/products', addProduct);

module.exports = router;
