const express = require("express");
const { addProduct, getAllProducts } = require("../controllers/productsController");

const router = express.Router();

router.post("/products", addProduct);
router.get("/getProduct" , getAllProducts  )
// router.delete('/deleteProduct/:id', deleteProduct); // Delete product
// router.put('/updateProduct/:id', updateProduct); 


module.exports = router;
