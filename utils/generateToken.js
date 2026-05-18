const e = require("express");
const jwt = require("jsonwebtoken");
const generateToken = (user)=>{
    
    return  token = jwt.sign(
      { id: user._id,
        // name: user.name,
        // email: user.email,
        role: user.role



       },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
}


module.exports = generateToken
