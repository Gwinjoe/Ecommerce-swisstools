const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  status: {
    type: String,
    required: true,
    default: "Pending"
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
      default: function() {
        return this.product.price.$numberDecimal * this.quantity
      }
    }
  }],
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  shippingAddress: {
    type: String,
    default: function() {
      return this.customer.address
    }
  },
  paymentMethod: {
    type: String,
  }

}, {
  timestamps: true,
})

module.exports = mongoose.model("Order", orderSchema);
