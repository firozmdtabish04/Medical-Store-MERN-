const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const pharmacyRoutes = require("./routes/pharmacy.routes");
const adminRoutes = require("./routes/admin.routes");
const medicineRoutes = require("./routes/medicine.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const notificationRoutes = require("./routes/notification.routes");

const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// ----------------------------------
// MIDDLEWARE
// ----------------------------------

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------------
// ROUTES
// ----------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/pharmacies", pharmacyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/notifications", notificationRoutes);

// ----------------------------------
// TEST API
// ----------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediFind API is running",
  });
});

// ----------------------------------
// ERROR HANDLER
// ----------------------------------

app.use(errorHandler);

// ----------------------------------
// HTTP SERVER
// ----------------------------------

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// ----------------------------------
// SOCKET.IO
// ----------------------------------

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-order", (orderId) => {
    socket.join(`order:${orderId}`);

    console.log(`Socket ${socket.id} joined order:${orderId}`);
  });

  socket.on("delivery-location", (data) => {
    console.log("Delivery location:", data);

    io.to(`order:${data.orderId}`).emit("delivery-location-updated", data);
  });

  socket.on("delivery-status", (data) => {
    console.log("Delivery status:", data);

    io.to(`order:${data.orderId}`).emit("order-status-updated", data);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// ----------------------------------
// START SERVER
// ----------------------------------

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    server.listen(PORT, () => {
      console.log(`MediFind server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
