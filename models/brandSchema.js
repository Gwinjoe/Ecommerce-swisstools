const mongoose = require("mongoose");

const brandSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name for the brand is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },

}, {
  timestamps: true,
})

module.exports = mongoose.model("Brand", brandSchema)
