const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require ("../utils/generateToken")

// REGISTER USER
const registerUser = async (req, res) => {
  console.log(req.body);
  const { name, email, password, confirmPassword } = req.body; // confirmPassword add kiya

  try {
    // Password match check
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Email already exists check
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const token = generateToken(user);
  

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, 
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCustomers = async (req, res) => {

  try {

    const users = await User.find({
      role: "user",
    });

    const customers = users.map((user) => {

      // Total Orders
      const totalOrders = user.orders.length;

      // Total Spent
      const totalSpent = user.orders.reduce(
        (acc, order) => acc + order.totalAmount,
        0
      );

      // Last Order
      const lastOrder =
        user.orders.length > 0
          ? user.orders[user.orders.length - 1].createdAt
          : null;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,

        orders: totalOrders,

        spent: `$${totalSpent}`,

        status: user.isActive ? "active" : "inactive",

        lastOrder: lastOrder
          ? new Date(lastOrder).toLocaleDateString()
          : "No Orders",

        profilePicture: user.profilePicture,
      };
    });

    res.status(200).json({
      success: true,
      customers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = { registerUser, loginUser, getAllCustomers };
