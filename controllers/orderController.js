const Order = require("../models/Order");

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Private
// const createOrder = async (req, res) => {
//   console.log(req.body);
  
//     try {
//     const {
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       taxPrice,
//       totalPrice,
//     } = req.body;

//     // ❌ Validation
//     if (!orderItems || orderItems.length === 0) {
//       return res.status(400).json({ message: "No order items" });
//     }

//     // ✅ Create Order
//     const order = new Order({
//         user: req.body.user, // from auth middleware

//       orderItems,
//       shippingAddress,
//       paymentMethod,

//       itemsPrice,
//       shippingPrice,
//       taxPrice,
//       totalPrice,
//     });

//     // 💾 Save in DB
//     const createdOrder = await order.save();

//     res.status(201).json(createdOrder);
//   } catch (error) {
//     res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// module.exports = { createOrder };


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    // ❌ Validation
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // ✅ Get user from middleware (IMPORTANT)
    const userId = req.user.id || req.user._id;

    // ✅ Create Order
    const order = new Order({
      user: userId,   // 🔥 yahan fix kiya
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // 💾 Save in DB
    const createdOrder = await order.save();

    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = { createOrder };