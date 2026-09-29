const { Server } = require("socket.io");

const setupDeliverySocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // ==========================================
    // CUSTOMER JOINS ORDER ROOM
    // ==========================================

    socket.on("join-order", (orderId) => {
      socket.join(`order:${orderId}`);

      console.log(`Socket ${socket.id} joined order:${orderId}`);
    });

    // ==========================================
    // DELIVERY PARTNER SENDS LOCATION
    // ==========================================

    socket.on("delivery-location", (data) => {
      const { orderId, latitude, longitude } = data;

      console.log("Delivery location:", data);

      io.to(`order:${orderId}`).emit("delivery-location-updated", {
        orderId,
        latitude,
        longitude,
      });
    });

    // ==========================================
    // DELIVERY STATUS
    // ==========================================

    socket.on("delivery-status", (data) => {
      const { orderId, status } = data;

      io.to(`order:${orderId}`).emit("order-status-updated", {
        orderId,
        status,
      });
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

module.exports = setupDeliverySocket;
