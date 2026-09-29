const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");

const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediFind API is running",
  });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MediFind server running on port ${PORT}`);
});
const pharmacyRoutes = require("./routes/pharmacy.routes");
app.use("/api/pharmacies", pharmacyRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);
const medicineRoutes = require("./routes/medicine.routes");
app.use("/api/medicines", medicineRoutes);
const orderRoutes = require("./routes/order.routes");
app.use("/api/orders", orderRoutes);