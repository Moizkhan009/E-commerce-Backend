const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("i am db function");
    

     reposne =  await mongoose.connect(process.env.MONGO_URI);
    
     
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
