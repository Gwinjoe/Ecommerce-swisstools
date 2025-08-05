const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A name for the product is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: mongoose.Types.Decimal128,
    required: [true, "A price is required for the product is required"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  stock: {
    type: Number,
    required: [true, "Stock Quantity is required"],
  },
  images: {
    mainImage: {
      url: {
        type: String,
        required: [true, "An Image is required for the product"],
      },
      publicId: {
        type: String,
        required: [true, "The product id is required"],
      }
    },
    thumbnails: [{
      url: {
        type: String,
        required: [true, "An Image is required for the product"],
      },
      publicId: {
        type: String,
        required: [true, "The product id is required"],
      }
    }],
  },
  keyFeatures: [{
    type: String,
  }],
  whatsInBox: [{
    type: String,
  }],
  productDetails: {
    type: String,
  },

}, {
  timestamps: true,
})

module.exports = mongoose.model("Product", productSchema)
