// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");
// const productsRoutes = require("./routes/productsRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");

// dotenv.config();

// const startServer = async () => {
//   await connectDB();

//   const app = express();
//   // app.use(cors());
//   app.use(cors());

//   app.use(express.json());

// app.use("/api/users" , userRoutes);
// app.use("/api/product",productsRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/wishlist", wishlistRoutes);



//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// startServer();

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authMiddleware = require("./middleware/authMiddleware");
const userRoutes = require("./routes/userRoutes");
const productsRoutes = require("./routes/productsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const Apiroutes = require("./routes/Apiroutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
// app.use(express.json());
dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173", // frontend URL
      credentials: true,               // allow cookies
    })
  );

  app.use(express.json());
app.use("/api", Apiroutes); // Mount API routes
  app.use("/api/users", userRoutes);
  app.use("/api/product", productsRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/orders", orderRoutes);
  // app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  
  // ✅ Test route (optional)
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};
// app.use(express.json());
startServer();