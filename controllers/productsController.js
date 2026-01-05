const Product = require('../models/Product');

// ✅ ADD PRODUCT (Controller)
exports.addProduct = async (req, res) => {
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
