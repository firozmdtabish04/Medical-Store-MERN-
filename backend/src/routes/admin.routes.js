const express = require("express");

const {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllPharmacies,
  getPendingPharmacies,
  approvePharmacy,
  rejectPharmacy,
  getAllOrders,
  getDeliveryPartners,
  getSettings,
  updateSettings,
} = require("../controllers/admin.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// Admin protection applied to all routes
router.use(protect, authorize("ADMIN"));

// Platform Stats
router.get("/stats", getAdminStats);

// User Management
router.get("/users", getAllUsers);
router.patch("/users/:id/status", toggleUserStatus);

// Pharmacy Management
router.get("/pharmacies", getAllPharmacies);
router.get("/pharmacies/pending", getPendingPharmacies);
router.patch("/pharmacies/:id/approve", approvePharmacy);
router.patch("/pharmacies/:id/reject", rejectPharmacy);

// Order Management
router.get("/orders", getAllOrders);

// Delivery Partner Management
router.get("/delivery-partners", getDeliveryPartners);

// Platform Settings
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

module.exports = router;
