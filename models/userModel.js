const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
  },
  email: {
    required: [true, "email is required"],
    type: String,
    trim: true,
    unique: [true, "email must be unique"],
    minLength: [5, "email must be more than 5 characters"],
    lowercase: true,
  },
  password: {
    required: [true, "Password is required"],
    select: false,
    trim: true,
    type: String,
  },
  admin: {
    type: Boolean,
    default: false,
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  }],
  cart: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  phoneNo: {
    trim: true,
    type: String,
  },
  address: {
    type: String,
  },
  active: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: function() {
      return this.active ? "Active" : "Inactive";
    }
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/dlmscmwth/image/upload/v1754088011/samples/two-ladies.jpg"
  },
  notifications: [{
    type: String,
  }],
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationCode: {
    type: String,
    select: false,
  },
  verificationCodeValidation: {
    type: Number,
    select: false,
  },
  forgotPasswordCode: {
    type: String,
    select: false,
  },
  forgotPasswordCodeValidation: {
    type: Number,
    select: false,
  }
}, {
  timestamps: true,
})

module.exports = mongoose.model("User", userSchema);
