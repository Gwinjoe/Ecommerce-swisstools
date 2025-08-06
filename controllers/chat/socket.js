const { Server } = require('socket.io');
const wrap = require('../../middlewares/wrapMiddleware');
const passport = require('passport');
const Users = require("../../models/userModel")
const Chats = require("../../models/chatSchema")

module.exports = function(server, sessionMiddleware) {
  const io = new Server(server);

  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));

  io.use((socket, next) => {
    if (socket.request.user) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', async (socket) => {
    const user = socket.request.user;
    const id = user._id;
    const isAdmin = user.admin;
    console.log(`User connected: ${user}`);
    let chats = []
    if (isAdmin) {
      chats = await Chats.find({ admin: id }).populate("user");
    } else {
      chats = await Chats.find({ admin: id }).populate("admin");
    }
    socket.on('chat message', (msg) => {
      console.log(`${user.email}: ${msg}`);
      // Broadcast to admin or whoever is supposed to receive
      socket.broadcast.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
      console.log(`${user.username} disconnected`);
    });
  });
};

