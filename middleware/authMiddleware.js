// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   // const token = req.headers.authorization?.split(" ")[1];
//   let token = req.headers.authorization;
//   console.log("Raw Autoriztion Headers" ,token);
  

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }
//  // handle "Bearer token" OR direct token
//   if (token.startsWith("Bearer ")) {
//     token = token.split(" ")[1];
//   }
//   try {
//     // const decoded = jwt.verify(token, "mySecretKey123");
//     const decoded = jwt.verify(token,process.env.JWT_SECRET);
//     req.user = decoded;
//     console.log(decoded);
    
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };

// module.exports = authMiddleware;


const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("Raw Authorization Header:", token);
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }
    
    // Handle "Bearer token" OR direct token
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    
    // IMPORTANT: Fetch complete user from database
    const user = await User.findById(decoded.id || decoded._id).select("-password");
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    // Attach complete user object to req
    req.user = user;
    console.log("User attached to req:", req.user._id);
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.body.status(401).json({ 
      success: false,
      message: "Invalid token" 
    });
  }
};

module.exports = authMiddleware;