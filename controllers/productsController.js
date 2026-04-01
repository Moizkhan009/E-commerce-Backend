
const Product = require('../models/Product');

// ✅ ADD PRODUCT (Already exists in your code)
exports.addProduct = async (req, res) => {
  console.log(req.body);
  
  try {
    const {
      name,
      category,
      brand,
      image,
      price,
      originalPrice,
      rating,
      badge,
      badgeColor
    } = req.body;

    // Validation
    if (!name || !category || !brand || !image || !price) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing'
      });
    }

    const product = await Product.create({
      name,
      category,
      brand,
      image,
      price,
      originalPrice,
      rating,
      badge,
      badgeColor
    });

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 📥 GET ALL PRODUCTS (Already exists in your code)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category'); // ✅ FIX

    res.status(200).json(products ,{
      success: true,
      count: products.length,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// 🗑️ DELETE PRODUCT (Add this new controller)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ✏️ UPDATE PRODUCT (Bonus - Optional)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
// ✅ GET PRODUCTS BY CATEGORY
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId   // 🔥 YAHAN USE HOGA
    }).populate('category');            // 🔥 AUR YEH BHI

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};