const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

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

// ==========================================
// DATABASE
// ==========================================

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/pharmacies", pharmacyRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/medicines", medicineRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/delivery", deliveryRoutes);

app.use("/api/notifications", notificationRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediFind API is running",
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(errorHandler);

// ==========================================
// SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MediFind server running on port ${PORT}`);
});
