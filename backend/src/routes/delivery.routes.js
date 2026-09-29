const express = require("express");

const {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getMyDeliveries,
} = require("../controllers/delivery.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// DELIVERY PARTNER

router.get(
  "/available",
  protect,
  authorize("DELIVERY"),
  getAvailableDeliveries,
);

router.get("/my", protect, authorize("DELIVERY"), getMyDeliveries);

router.patch("/:id/accept", protect, authorize("DELIVERY"), acceptDelivery);

router.patch(
  "/:id/status",
  protect,
  authorize("DELIVERY"),
  updateDeliveryStatus,
);

module.exports = router;
