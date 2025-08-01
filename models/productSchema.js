const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name for the category is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "A description for the category is required"],
    trim: true,
  },

}, {
  timestamps: true,
})

module.exports = mongoose.model("Product", productSchema)
