let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, { cors: { origin: '*' } });

  io.on('connection', (socket) => {
    // Join role-based rooms
    socket.on('join', (data) => {
      if (data.userId) socket.join(`user_${data.userId}`);
      if (data.role) socket.join(`role_${data.role}`);
      if (data.agencyId) socket.join(`agency_${data.agencyId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
};

module.exports = { initSocket, getIO };
