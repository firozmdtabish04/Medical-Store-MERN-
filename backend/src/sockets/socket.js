let io;

const setIO = (socketIO) => {
  io = socketIO;
};

const getIO = () => {
  return io;
};

const emitToOrder = (orderId, event, data) => {
  if (io) {
    try {
      io.to(`order:${orderId}`).emit(event, data);
    } catch (err) {
      console.error("Socket emit error:", err);
    }
  }
};

module.exports = {
  setIO,
  getIO,
  emitToOrder,
};
