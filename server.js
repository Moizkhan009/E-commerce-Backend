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

const userRoutes = require("./routes/userRoutes");
const productsRoutes = require("./routes/productsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();

  // ✅ FIXED CORS (IMPORTANT)
  app.use(
    cors({
      origin: "http://localhost:5173", // frontend URL
      credentials: true,               // allow cookies
    })
  );

  // ✅ Middleware
  app.use(express.json());

  // ✅ Routes
  app.use("/api/users", userRoutes);
  app.use("/api/product", productsRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/wishlist", wishlistRoutes);

  // ✅ Test route (optional)
  app.get("/", (req, res) => {
    res.send("API is running...");
  });

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

