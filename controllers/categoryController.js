// const Category = require("../models/Category");
const Category =require("../models/Category");
const Product = require("../models/Product")


// CREATE CATEGORY
exports.createCategory = async (req, res) => {
  console.log(req.body);
  try {
    const { name } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      categories: categories  // ✅ Send as object with categories array
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET CATEGORY BY ID

exports.getProductsByCategoryId = async (req, res) => {
  // console.log(req.params)
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }

    // Find all products with this category id
    const products = await Product.find({ category: id })
      .populate("category", "name"); // optional (category name bhi aa jayega)

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    res.status(200).json(products);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
