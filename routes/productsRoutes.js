const express = require("express");
const { addProduct, getAllProducts , getProductsByCategory } = require("../controllers/productsController");

const router = express.Router();

router.post("/products", addProduct);
router.get("/getProduct" , getAllProducts  );
router.get('/products/category/:categoryId', getProductsByCategory);
// router.delete('/deleteProduct/:id', deleteProduct); // Delete product
// router.put('/updateProduct/:id', updateProduct); 


module.exports = router;
