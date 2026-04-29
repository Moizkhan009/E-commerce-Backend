const express = require("express");
const { 
  addProduct, 
  getAllProducts, 
  getProductsByCategory 
} = require("../controllers/productsController");

const router = express.Router();

router.post("/", addProduct);
router.get("/get", getAllProducts);
router.get("/products/category/:categoryId", getProductsByCategory);

module.exports = router;