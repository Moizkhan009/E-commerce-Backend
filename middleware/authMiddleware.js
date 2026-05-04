const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }
 // handle "Bearer token" OR direct token
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  try {
    // const decoded = jwt.verify(token, "mySecretKey123");
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    console.log(decoded);
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;