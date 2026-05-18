// // // const User = require("../models/User");
// // // const Product = require("../models/Product");

// // // exports.getDashboardStats = async (req, res) => {

// // //   try {

// // //     // Total Customers
// // //     const totalCustomers = await User.countDocuments({
// // //       role: "user",
// // //     });

// // //     // Total Products
// // //     const totalProducts = await Product.countDocuments();

// // //     // Example static data (abhi order model nahi hai to)
// // //     const totalOrders = 1234;

// // //     const totalRevenue = 45231;

// // //     const productsSold = 892;

// // //     res.status(200).json({

// // //       success: true,

// // //       stats: {
// // //         totalCustomers,
// // //         totalProducts,
// // //         totalOrders,
// // //         totalRevenue,
// // //         productsSold,
// // //       },
// // //     });

// // //   } catch (error) {

// // //     res.status(500).json({

// // //       success: false,

// // //       message: error.message,
// // //     });
// // //   }
// // // };
// // const User = require("../models/User");
// // const Product = require("../models/Product");

// // // exports.getDashboardStats = async (req, res) => {
// // //   try {

// // //     const users = await User.find({ role: "user" });

// // //     let totalOrders = 0;
// // //     let totalRevenue = 0;

// // //     users.forEach((user) => {
// // //       totalOrders += user.orders.length;

// // //       user.orders.forEach((order) => {
// // //         totalRevenue += order.totalAmount;
// // //       });
// // //     });

// // //     const totalCustomers = users.length;
// // //     const totalProducts = await Product.countDocuments();

// // //     res.status(200).json({
// // //       success: true,
// // //       stats: {
// // //         totalCustomers,
// // //         totalProducts,
// // //         totalOrders,
// // //         totalRevenue,
// // //         productsSold: totalOrders, // optional mapping
// // //       },
// // //     });

// // //   } catch (error) {
// // //     res.status(500).json({
// // //       success: false,
// // //       message: error.message,
// // //     });
// // //   }
// // // };

// // exports.getDashboard = async (req, res) => {

// //   const users = await User.find({ role: "user" });
// //   const products = await Product.find();
// //   const orders = users.flatMap(u => u.orders);

// //   // STATS
// //   let totalRevenue = 0;

// //   orders.forEach(o => {
// //     totalRevenue += o.totalAmount;
// //   });

// //   // TOP SELLING PRODUCTS
// //   const productMap = {};

// //   orders.forEach(order => {
// //     order.items.forEach(item => {

// //       if (!productMap[item.productId]) {
// //         productMap[item.productId] = {
// //           name: item.productName,
// //           quantity: 0,
// //         };
// //       }

// //       productMap[item.productId].quantity += item.quantity;
// //     });
// //   });

// //   const topProducts = Object.values(productMap)
// //     .sort((a, b) => b.quantity - a.quantity)
// //     .slice(0, 5);

// //   // LOW STOCK
// //   const lowStockProducts = products.filter(p => p.countInStock < 10);

// //   res.json({
// //     stats: {
// //       totalCustomers: users.length,
// //       totalProducts: products.length,
// //       totalOrders: orders.length,
// //       totalRevenue,
// //     },

// //     topProducts,

// //     lowStockProducts,

// //     inventorySummary: {
// //       totalStock: products.reduce((acc, p) => acc + p.countInStock, 0),
// //       lowStock: lowStockProducts.length,
// //     },
// //   });
// // };


// // backend/controllers/dashboardController.js
// const User = require("../models/User");
// const Product = require("../models/Product");

// exports.getDashboard = async (req, res) => {
//   try {
//     const users = await User.find({ role: "user" });
//     const products = await Product.find();
    
//     // Safely extract orders
//     const orders = users.flatMap(u => u.orders || []);
    
//     // Calculate stats with fallbacks
//     let totalRevenue = 0;
//     orders.forEach(o => {
//       totalRevenue += o.totalAmount || 0;
//     });
    
//     // Top selling products
//     const productMap = {};
    
//     orders.forEach(order => {
//       if (order.items && order.items.length > 0) {
//         order.items.forEach(item => {
//           const productId = item.productId?.toString() || 'unknown';
//           if (!productMap[productId]) {
//             productMap[productId] = {
//               name: item.productName || "Unknown Product",
//               quantity: 0,
//             };
//           }
//           productMap[productId].quantity += item.quantity || 0;
//         });
//       }
//     });
    
//     let topProducts = Object.values(productMap)
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, 5);
    
//     // If no orders, return meaningful data
//     if (orders.length === 0) {
//       return res.json({
//         stats: {
//           totalCustomers: users.length,
//           totalProducts: products.length,
//           totalOrders: 0,
//           totalRevenue: 0,
//         },
//         topProducts: [],
//         lowStockProducts: products.filter(p => (p.countInStock || 0) < 10),
//         inventorySummary: {
//           totalStock: products.reduce((acc, p) => acc + (p.countInStock || 0), 0),
//           lowStock: products.filter(p => (p.countInStock || 0) < 10).length,
//         },
//         message: "No orders found. Please add some orders first."
//       });
//     }
    
//     // Low stock products
//     const lowStockProducts = products.filter(p => (p.countInStock || 0) < 10);
    
//     res.json({
//       stats: {
//         totalCustomers: users.length,
//         totalProducts: products.length,
//         totalOrders: orders.length,
//         totalRevenue: totalRevenue,
//       },
//       topProducts: topProducts,
//       lowStockProducts: lowStockProducts,
//       inventorySummary: {
//         totalStock: products.reduce((acc, p) => acc + (p.countInStock || 0), 0),
//         lowStock: lowStockProducts.length,
//       },
//     });
    
//   } catch (error) {
//     console.error("Dashboard Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// backend/controllers/dashboardController.js
const User = require("../models/User");
const Product = require("../models/Product");

exports.getDashboard = async (req, res) => {
  try {
    console.log("🟢 Dashboard API called");
    
    // Fetch users with role "user"
    const users = await User.find({ role: "user" });
    console.log(`📊 Found ${users.length} users`);
    
    // Fetch all products
    const products = await Product.find();
    console.log(`📦 Found ${products.length} products`);
    
    // Collect all orders
    let allOrders = [];
    let totalRevenue = 0;
    
    users.forEach(user => {
      if (user.orders && Array.isArray(user.orders)) {
        console.log(`👤 User ${user.email}: ${user.orders.length} orders`);
        user.orders.forEach(order => {
          allOrders.push(order);
          totalRevenue += order.totalAmount || 0;
        });
      }
    });
    
    console.log(`📝 Total orders collected: ${allOrders.length}`);
    console.log(`💰 Total revenue: ${totalRevenue}`);
    
    // Calculate top selling products
    const productSalesMap = new Map();
    
    allOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const productId = item.productId?.toString();
          if (productId) {
            if (productSalesMap.has(productId)) {
              const existing = productSalesMap.get(productId);
              existing.quantity += item.quantity || 0;
              productSalesMap.set(productId, existing);
            } else {
              productSalesMap.set(productId, {
                name: item.productName || "Unknown Product",
                quantity: item.quantity || 0,
                productId: productId
              });
            }
          }
        });
      }
    });
    
    const topProducts = Array.from(productSalesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    console.log(`🏆 Top products: ${topProducts.length}`);
    
    // Low stock products
    const lowStockProducts = products.filter(p => (p.countInStock || 0) < 10);
    
    // Response
    const responseData = {
      stats: {
        totalCustomers: users.length,
        totalProducts: products.length,
        totalOrders: allOrders.length,
        totalRevenue: totalRevenue,
      },
      topProducts: topProducts,
      lowStockProducts: lowStockProducts.map(p => ({
        name: p.name,
        countInStock: p.countInStock || 0
      })),
      inventorySummary: {
        totalStock: products.reduce((acc, p) => acc + (p.countInStock || 0), 0),
        lowStock: lowStockProducts.length,
      }
    };
    
    // console.log(" Sending response:", JSON.stringify(responseData.stats, null, 2));
    res.json(responseData);
    
  } catch (error) {
    // console.error(" Dashboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
};