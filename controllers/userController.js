const User = require("../models/userModel");
const { dohash, dohashValidation, hmacProcess } = require("../utils/hashing");



exports.get_users = async (req, res) => {
  try {
    const data = await User.find();
    if (!data) {
      return res.status(401).json({ success: false, message: "No User Found!" });
    }
    res.status(200).json({ success: true, data })
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

exports.get_user = async (req, res) => {
  const id = req.user._id;
  try {
    const data = await User.findById(id);
    if (!data) {
      return res.status(401).json({ success: false, message: "No user Found!" });
    }
    res.status(200).json({ success: true, data })
  } catch (err) {
    if (err) {
      console.log(err)
    }
  }
}

exports.get_user_by_id = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await User.findById(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "No user matches that id" });
    }

    console.log(`user-${id}: ${result}`);
    res.status(201).json({ success: true, result })
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.add_user = async (req, res) => {
  const { name, email, password, admin } = req.body;
  try {

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      console.log("user already exists")
      return res.status(401).json({ success: false, message: "user already exists!" })
    }
    const hashedPassword = await dohash(password, 12);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      admin
    })

    const result = await newUser.save();
    console.log(result)
    res.status(201).json({ success: true, message: "New User has been created successfuly", result });
  } catch (error) {
    console.log(error)
  }
}

exports.edit_user = async (req, res) => {
  const { id, name, email, password, admin } = req.body;
  try {
    const existingUser = await User.findById(id).select("+password");

    if (!existingUser) {
      return res.status(401).json({ success: false, message: "Cannot find user" });
    }

    if (name) {
      existingUser.name = name;
    }

    if (email) {
      existingUser.email = email;
    }
    if (password) {
      existingUser.password = await dohash(password, 12);
    }
    if (admin) {
      existingUser.admin = admin;
    }
    const results = await existingUser.save();
    console.log(results);
    res.status(201).json({ success: true, results })
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.user_count = async (req, res) => {
  const userCount = await User.countDocuments({});
  res.status(200).json({ success: true, userCount })
}

exports.delete_user = async (req, res) => {
  const { id } = req.params;

  try {
    if (id == req.user._id) {
      return res.status(401).json({ success: false, message: "Cant delete the current user" });
    }
    const result = await User.findByIdAndDelete(id);
    if (!result) {
      return res.status(401).json({ success: false, message: "couldn't find and Delete the User you are looking for" });
    }
    console.log(result)
    res.status(201).json({ success: true, message: "User Deleted!" });
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.deletefrom_cart = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    existingUser.cart.filter((product) => product._id !== itemId);
    const results = await existingUser.save();
    res.status(201).json({ success: true, message: "Item added successfully" });
  } catch (err) {
    if (err) console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}

exports.deletefrom_wishlist = async (req, res) => {
  const { userId, itemId } = req.body;
  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    existingUser.wishlist.filter((product) => product._id !== itemId);
    const results = await existingUser.save();
    res.status(201).json({ success: true, message: "Item added successfully" });
  } catch (err) {
    if (err) console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}

exports.addTo_cart = async (req, res) => {
  const { id, cartItem } = req.body;
  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    if (cartItem) {
      existingUser.cart.push(cartItem);
    }
    const results = await existingUser.save();
    res.status(201).json({ success: true, message: "Item added successfully" });
  } catch (err) {
    if (err) console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}

exports.addTo_wishlist = async (req, res) => {
  const { id, item } = req.body;
  try {
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "User not found" })
    }

    if (item) {
      existingUser.wishlist.push(item);
    }
    const results = await existingUser.save();
    res.status(201).json({ success: true, message: "Item added successfully" });
  } catch (err) {
    if (err) console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
}
