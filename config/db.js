// const { default: mongoose } = require("mongoose");

// const mongoose = require("mongoose");
const mongoose = require("mongoose")

const connectDB = async () => {
  try {

     reposne =  await mongoose.connect(process.env.MONGO_URI);
    
     
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
