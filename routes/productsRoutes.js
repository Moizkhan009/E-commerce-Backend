const express = require("express");
const { addProduct, getAllProducts } = require("../controllers/productsController");

const router = express.Router();

router.post("/products", addProduct);
router.get("/getProduct" , getAllProducts  )

module.exports = router;
