// const express = require("express");
// const { 
//   addProduct, 
//   getAllProducts, 
//   getProductById,
//   getProductsByCategory ,
//   updateProduct,
//   deleteProduct,
//   getProductsBySection,
  
// } = require("../controllers/productsController");
// const { route } = require("./productsRoutes");

// const router = express.Router();

// router.post("/", addProduct);
// router.put("/update/:id",updateProduct);
// router.delete("/:id", deleteProduct)
// router.get("/get", getAllProducts);
// router.get("/section/:section", getProductsBySection);
// router.get("/:id", getProductById);
// // router.get("/products/category/:categoryId", getProductsByCategory);

// module.exports = router;
const express = require("express");
const {
  addProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProduct,
  getProductsBySection,
} = require("../controllers/productsController");

const router = express.Router();

router.post("/", addProduct);
router.put("/update/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/get", getAllProducts);

router.get("/section/:section", getProductsBySection);

router.get("/product/category/:categoryId", getProductsByCategory);

router.get("/:id", getProductById);

module.exports = router;