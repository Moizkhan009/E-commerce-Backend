const express = require("express");
const { 
  addProduct, 
  getAllProducts, 
  getProductById,
  getProductsByCategory ,
} = require("../controllers/productsController");

const router = express.Router();

router.post("/", addProduct);
router.get("/get", getAllProducts);
router.get("/:id", getProductById);
router.get("/products/category/:categoryId", getProductsByCategory);

module.exports = router;