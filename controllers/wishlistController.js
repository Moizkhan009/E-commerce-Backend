// const Wishlist = require("../models/Wishlist");
// const Product = require("../models/Product");
// const mongoose = require("mongoose");


// // ✅ TOGGLE WISHLIST (Add + Remove in ONE API)
// const toggleWishlist = async (req, res) => {
//   try {
//     const {productId}  = req.body;
//     console.log(productId)
//     // 🔐 real world: user token se aata hai
//     const user = req.user; // assume middleware laga hai
//      console.log(user.id)
//      const users = user.id;
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({ message: "Invalid productId" });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const existing = await Wishlist.findOne({ users, product: productId });

//     if (existing) {
//       await existing.deleteOne();
//       return res.status(200).json({
//         message: "Removed from wishlist",
//         inWishlist: false,
//       });
//     }

//     await Wishlist.create({
//       users,
//       product: product._id,
//       name: product.name,
//       image: product.image,
//       price: product.price,
//     });

//     res.status(201).json({
//       message: "Added to wishlist",
//       inWishlist: true,
//     });

//   } catch (error) {
//     // duplicate safety
//     if (error.code === 11000) {
//       return res.status(200).json({ message: "Already exists" });
//     }

//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ GET USER WISHLIST
// const getWishlist = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const items = await Wishlist.find({ user: userId })
//       .populate("product")
//       .sort({ createdAt: -1 });

//     res.status(200).json(items);

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// // ✅ CHECK SINGLE PRODUCT (for UI heart icon)
// const checkWishlist = async (req, res) => {
//   try {
//     const userId  = req.user.id;
//       const {productId}  = req.params;

//     const exists = await Wishlist.exists({
//       user: userId,
//       product: productId,
//     });

//     res.status(200).json({ inWishlist: !!exists });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// module.exports = {
//   toggleWishlist,
//   getWishlist,
//   checkWishlist,
// };

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// ✅ TOGGLE WISHLIST (Add + Remove in ONE API)
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;   // 🔥 consistent naam

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid productId" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 "user" use kar (NOT "users")
    const existing = await Wishlist.findOne({ user: userId, product: productId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({
        message: "Removed from wishlist",
        inWishlist: false,
      });
    }

    await Wishlist.create({
      user: userId,                  // 🔥 "user"
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
    });

    res.status(201).json({
      message: "Added to wishlist",
      inWishlist: true,
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(200).json({ message: "Already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};


// ✅ GET USER WISHLIST
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Wishlist.find({ user: userId })   // 🔥 "user"
      .populate("product")
      .sort({ createdAt: -1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ CHECK SINGLE PRODUCT
const checkWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const exists = await Wishlist.exists({
      user: userId,           // 🔥 "user"
      product: productId,
    });

    res.status(200).json({ inWishlist: !!exists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  toggleWishlist,
  getWishlist,
  checkWishlist,
};