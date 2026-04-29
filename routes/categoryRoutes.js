const express = require("express");
const {
  createCategory,
  getCategories,  // ✅ Sahi function name
  updateCategory,
  deleteCategory,
  getCategoryById
} = require("../controllers/categoryController");

const router = express.Router();

// ✅ Sabhi routes sahi handler functions ke saath
// router.get("/category/:id", getCategoryById);
router.post("/", createCategory);
router.get("/categories", getCategories);  // ✅ getCategories use karo


router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;