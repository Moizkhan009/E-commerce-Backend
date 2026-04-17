const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require ("./routes/userRoutes");
const productsRoutes = require ("./routes/productsRoutes")
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes =  require ("./routes/orderRoutes")
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users" , userRoutes);
app.use("/api",productsRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

