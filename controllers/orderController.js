// const User = require("../models/User");
// // const Order = require("../models/Order");
// const Cart = require("../models/Cart");

// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//     } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No order items" });
//     }

//     const user = await User.findById(req.user._id);

//     const newOrder = {
//       orderId: "ORD-" + Date.now(),
//       items,
//       shippingAddress,
//       paymentMethod,
//       totalAmount,
//       orderStatus: "pending",
//       orderDate: new Date(),
//     };

//     user.orders.push(newOrder);
//     // Save the user with the new order
//     await user.save();

//     // Clear user's cart after order creation
//         await Cart.findOneAndUpdate(
//       { user: req.user._id },
//       {
//         $set: {
//           cartItems: [],
//           totalPrice: 0,
//         },
//       }
//     );

//     res.status(201).json({
//       success: true,
//       data: newOrder,
//     });

//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// // @desc    Get Orders
// // @route   GET /api/orders
// // @access  Private
// const getAllOrders = async (req, res) => {
//   try {
//     const users = await User.find({}).select('name email orders');

//     let allOrders = [];

//     users.forEach(user => {
//       const ordersWithUser = user.orders.map(order => ({
//         ...order._doc,
//         user: {
//           _id: user._id,
//           name: user.name,
//           email: user.email
//         }
//       }));

//       allOrders = [...allOrders, ...ordersWithUser];
//     });

//     res.json({
//       success: true,
//       count: allOrders.length,
//       orders: allOrders
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getOrders = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     const orders = user.orders.sort(
//       (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
//     );

//     res.status(200).json({
//       success: true,
//       count: orders.length,
//       data: orders,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Cancel Order
// const cancelOrder = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id);

//     const order = user.orders.id(req.params.orderId);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (!["pending", "processing"].includes(order.orderStatus)) {
//       return res.status(400).json({
//         message: "Cannot cancel this order",
//       });
//     }

//     order.orderStatus = "cancelled";
//     await user.save();

//     res.json({
//       success: true,
//       data: order,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const updateOrderStatus = async (req, res) => {
//   try {

//     const { status } = req.body;

//     const users = await User.find({});

//     let updatedOrder = null;

//     for (const user of users) {

//       const order = user.orders.id(req.params.orderId);

//       if (order) {

//         order.orderStatus = status;

//         await user.save();

//         updatedOrder = order;

//         break;
//       }
//     }

//     if (!updatedOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Order status updated",
//       order: updatedOrder,
//     });

//   } catch (error) {

//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });

//   }
// };

// module.exports = {
//   createOrder,
//   getOrders,
//   cancelOrder,
//   getAllOrders,
//   updateOrderStatus,
// };

const User = require("../models/User");
const Cart = require("../models/Cart");
const Product = require("../models/Product"); // Add this import

const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Check and decrement product quantities
    for (const item of items) {
      const product = await Product.findById(item.productId);
       console.log(`📦 Before: ${product.name} - Stock: ${product.countInStock}`);
      
      if (!product) {
        return res.status(404).json({ 
          message: `Product not found: ${item.productName || item.productId}` 
        });
      }

      if (product.countInStock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Only ${product.countInStock} items available.` 
        });
      }

      // Decrease product countInStock
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { countInStock: -item.quantity } }
      );
    }

    const user = await User.findById(req.user._id);

    const newOrder = {
      orderId: "ORD-" + Date.now(),
      items,
      shippingAddress,
      paymentMethod,
      totalAmount,
      orderStatus: "pending",
      orderDate: new Date(),
    };

    user.orders.push(newOrder);
    // Save the user with the new order
    await user.save();

    // Clear user's cart after order creation
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          cartItems: [],
          totalPrice: 0,
        },
      }
    );

    res.status(201).json({
      success: true,
      data: newOrder,
      message: "Order placed successfully. Stock updated.",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get Orders
// @route   GET /api/orders
// @access  Private
const getAllOrders = async (req, res) => {
  try {
    const users = await User.find({}).select('name email orders');

    let allOrders = [];

    users.forEach(user => {
      const ordersWithUser = user.orders.map(order => ({
        ...order._doc,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }));

      allOrders = [...allOrders, ...ordersWithUser];
    });

    res.json({
      success: true,
      count: allOrders.length,
      orders: allOrders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const orders = user.orders.sort(
      (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
    );

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel Order (Updated with stock restore)
const cancelOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const order = user.orders.id(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (!["pending", "processing"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: "Cannot cancel this order",
      });
    }

    // Restore product quantities when order is cancelled
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { countInStock: item.quantity } } // Add back the quantity to countInStock
      );
    }

    order.orderStatus = "cancelled";
    await user.save();

    res.json({
      success: true,
      data: order,
      message: "Order cancelled. Stock restored.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;

    const users = await User.find({});

    let updatedOrder = null;

    for (const user of users) {

      const order = user.orders.id(req.params.orderId);

      if (order) {

        order.orderStatus = status;

        await user.save();

        updatedOrder = order;

        break;
      }
    }

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated",
      order: updatedOrder,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  createOrder,
  getOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};