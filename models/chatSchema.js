const mongoose = require("mongoose");
// {
//   id: 1,
//     contact: "Support Team",
//       avatar: "assets/images/team1.jpeg",
//         status: "Online",
//           messages: [
//             { id: 1, text: "Hello! How can we assist you today?", sender: "support", time: "10:30 AM", read: true },
//             { id: 2, text: "I have an issue with my order #1234.", sender: "user", time: "10:32 AM", read: true },
//             { id: 3, text: "Can you provide more details about the issue?", sender: "support", time: "10:35 AM", read: true }
//           ]
// }
//

const chatSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  messages: [{
    text: {
      type: String,
    },
    sender: {
      type: String
    },
    read: {
      type: Boolean,
      default: false,
    },
    time: {
      type: String,
      default: new Intl.DateTimeFormat('default', {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }).format(new Date()),
    }
  }],

}, {
  timestamps: true,
})

module.exports = mongoose.model("Chat", chatSchema)
