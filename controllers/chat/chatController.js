const Users = require("../../models/userModel");
const Chats = require("../../models/chatSchema");

exports.getChatsThread = async (req, res) => {
  const id = req.user._id;

  try {
    const existingChat = await Chats.find({ user: id }).sort({ createdAt: -1 }).populate("admin");
    console.log("user chats Thread : " + existingChat);
    if (!existingChat || !existingChat.length) {
      const admins = await Users.find({ admin: true });
      const activeAdmins = admins.length > 1 ? admins.map((admin) => {
        if (admin.active === true) {
          return admin
        }
      }) : admins;
      console.log(activeAdmins)
      const randomIndex = Math.floor(Math.random() * activeAdmins.length);
      const randomAdmin = activeAdmins[randomIndex];
      console.log(randomAdmin)
      const newChat = new Chats({
        user: id,
        admin: randomAdmin._id,
      })

      const results = await newChat.save();
      console.log(results)
      return res.status(201).json({ success: true, results });
    }
    res.status(201).json({ success: true, existingChat })
  } catch (err) {
    if (err) console.log(err)
    res.status(500).json({ success: false, message: "Server ERR || user not logged in" })
  }
}

exports.getAdminChatsThread = async (req, res) => {
  const id = req.user._id;
  try {
    const results = await Chats.find({ admin: id }).sort({ createdAt: -1 }).populate("user");
    if (!results) {
      return res.status(401).json({ success: false, message: "no active chats" });
    }

    console.log("Admin chats Thread : " + results);
    res.status(201).json({ success: true, results })
  } catch (err) {
    if (err) console.log(err)
  }
}

exports.getChats = async (req, res) => {
  try {
    const existingChats = await Chats.find();
    if (!existingChats) {
      return res.status(401).json({ success: false, message: "No Chats Found" });
    }
    res.status(201).json({ success: true, existingChats })
  } catch (err) {
    if (err) console.log(err)
  }
}
