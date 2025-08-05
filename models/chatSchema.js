const mongoose = require("mongoose");
{
  id: 1,
    contact: "Support Team",
      avatar: "assets/images/team1.jpeg",
        status: "Online",
          messages: [
            { id: 1, text: "Hello! How can we assist you today?", sender: "support", time: "10:30 AM", read: true },
            { id: 2, text: "I have an issue with my order #1234.", sender: "user", time: "10:32 AM", read: true },
            { id: 3, text: "Can you provide more details about the issue?", sender: "support", time: "10:35 AM", read: true }
          ]
}


const chatSchema = mongoose.Schema({
  contact: {
    type: mongoose.Types.Schema.ObjectId,
    ref: "User",
    required: [true, "A user is required"],
  },
  messages: [{
    text: {
      type: String,
      required: [true, "A message is required"],
    },
    sender: {
      type: mongoose.Types.Schema.ObjectId,
      ref: "User",
      required: [true, "A sender is required"],
    },
    read: {
      type: Boolean,
      default: false,
    }
  }, { timestamps: true }],

}, {
  timestamps: true,
})

module.exports = mongoose.model("Chat", chatSchema)
