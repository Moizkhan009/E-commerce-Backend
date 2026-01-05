const express = require("express");
const { addProduct } = require("../controllers/productsController");

const router = express.Router();

router.post("/products", addProduct);

module.exports = router;
