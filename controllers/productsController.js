
// const Product = require('../models/Product');

// // ✅ ADD PRODUCT (Already exists in your code)
// exports.addProduct = async (req, res) => {
//   // console.log(req.body);
  
//   try {
//     const {
//       name,
//       category,
//       brand,
//       image,
//       price,
//       originalPrice,
//       rating,
//       badge,
//       badgeColor,
//       countInStock,
//       sections,

//     } = req.body;

//     // Validation
//     if (!name || !category || !brand || !image || !price) {
//       return res.status(400).json({
//         success: false,
//         message: 'Required fields are missing'
//       });
//     }

//     const product = await Product.create({
//       name,
//       category,
//       brand,
//       image,
//       price,
//       originalPrice,
//       rating,
//       badge,
//       badgeColor
//     });

//     res.status(201).json({
//       success: true,
//       message: 'Product added successfully',
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // 📥 GET ALL PRODUCTS 
// exports.getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find().populate('category'); 

//     res.status(200).json({
//       success: true,
//       count: products.length,
//       products
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };
//   // GET PRODUCTS BY SECTION
// exports.getProductsBySection = async (req, res) => {
//   try {
//     const { section } = req.params;

//     // console.log("Requested Section:", section);

//     const products = await Product.find({
//       [`sections.${section}`]: true
//     }).populate("category", "name");

//     res.status(200).json({
//       success: true,
//       section,
//       count: products.length,
//       products
//     });

//   } catch (error) {
//     console.error("Section Error:", error);

//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
// // 📦 GET SINGLE PRODUCT (DETAIL PAGE)
// exports.getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findById(id).populate('category');

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: "Product not found"
//       });
//     }

//     res.status(200).json({
//       success: true,
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// // 🗑️ DELETE PRODUCT (Add this new controller)
// exports.deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findByIdAndDelete(id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Product deleted successfully',
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };

// // ✏️ UPDATE PRODUCT (Bonus - Optional)
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     const product = await Product.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         message: 'Product not found'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Product updated successfully',
//       product
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message
//     });
//   }
// };
// // productsController.js
// exports.getProductsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;  // ✅ Note: categoryId, not Id
//     // console.log("Category ID:", categoryId);
    
//     const products = await Product.find({ category: categoryId })
//       .populate('category', 'name');
    
//     res.status(200).json({
//       success: true,
//       products: products,
//       count: products.length
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
const Product = require('../models/Product');


// ===============================
// ✅ ADD PRODUCT (SINGLE + BULK)
// ===============================
exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    // 🔥 BULK INSERT
    if (Array.isArray(data)) {

      // validation for each product
      const invalid = data.some(item =>
        !item.name || !item.category || !item.brand || !item.image || !item.price
      );

      if (invalid) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing in one or more products"
        });
      }

      const products = await Product.insertMany(data);

      return res.status(201).json({
        success: true,
        message: "Bulk products added successfully",
        count: products.length,
        products
      });
    }

    // 🔥 SINGLE INSERT
    const {
      name,
      category,
      brand,
      image,
      price,
      originalPrice,
      rating,
      badge,
      badgeColor,
      countInStock,
      sections
    } = data;

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
      badgeColor,
      countInStock,
      sections
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


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('category');

    res.status(200).json({
      success: true,
      count: products.length,
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


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

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


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
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


exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId })
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.getProductsBySection = async (req, res) => {
  try {
    const { section } = req.params;

    const products = await Product.find({
      [`sections.${section}`]: true
    }).populate("category", "name");

    res.status(200).json({
      success: true,
      section,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};