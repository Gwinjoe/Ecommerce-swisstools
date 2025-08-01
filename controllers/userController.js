const User = require("../models/userModel");
const { dohash, dohashValidation, hmacProcess } = require("../utils/hashing");

exports.get_users = async (req, res) => {
  try {
    const data = await User.find();
    if (!data) {
      return res.status(401).json({ success: false, message: "No Category Found!" });
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
  const { id, name, email, admin } = req.body;
  try {
    const existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(401).json({ success: false, message: "Cannot find user" });
    }

    if (name) {
      existingUser.name = name;
    }

    if (email) {
      existingUser.email = email;
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
