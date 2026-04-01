const express = require("express");
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/addCategory", createCategory);
// router.get("/category/:id", getCategoryById);

router.get("/Get", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
