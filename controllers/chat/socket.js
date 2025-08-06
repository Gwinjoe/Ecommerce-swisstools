const { Server } = require('socket.io');
const wrap = require('../../middlewares/wrapMiddleware');
const passport = require('passport');

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

  io.on('connection', (socket) => {
    const user = socket.request.user;
    console.log(`User connected: ${user}`);

    socket.on('chat message', (msg) => {
      console.log(`${user.email}: ${msg}`);
      // Broadcast to admin or whoever is supposed to receive
      io.emit('chat message', {
        user: user.username,
        message: msg,
      });
    });

    socket.on('disconnect', () => {
      console.log(`${user.username} disconnected`);
    });
  });
};

