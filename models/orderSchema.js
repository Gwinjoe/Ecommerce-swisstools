const mongoose = require("mongoose");

{ id: "#O002", customer: "Jane Smith", date: "2025-07-04", category: "tools", amount: 300, status: "shipped" },
const orderSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    totalPrice: {
      type: mongoose.Types.Decimal128,
    }
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },


}, {
  timestamps: true,
})

module.exports = mongoose.model("Order", orderSchema);
