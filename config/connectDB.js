if (process.env.NODE_ENV != "production") require("dotenv").config();
const mongoose = require("mongoose");
const DATABASE_URI = process.env.DATABASE_URI;
const connectDB = async (db_uri) => {
  try {
    await mongoose.connect(db_uri);
    console.log(`DATABASE CONNECTED TO ${db_uri}`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = connectDB;
