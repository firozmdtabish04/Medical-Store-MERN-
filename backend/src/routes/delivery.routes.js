const express = require("express");

const {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getActiveDelivery,
  getMyDeliveries,
  getDeliveryStats,
} = require("../controllers/delivery.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// DELIVERY PARTNER ONLY
router.use(protect, authorize("DELIVERY"));

router.get("/available", getAvailableDeliveries);
router.get("/active", getActiveDelivery);
router.get("/my-deliveries", getMyDeliveries);
router.get("/stats", getDeliveryStats);
router.post("/:id/accept", acceptDelivery);
router.patch("/:id/status", updateDeliveryStatus);

module.exports = router;
