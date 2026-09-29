const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getPharmacyOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// CUSTOMER
router.post("/", protect, authorize("CUSTOMER"), placeOrder);

router.get("/my", protect, authorize("CUSTOMER"), getMyOrders);

router.get("/:id", protect, authorize("CUSTOMER"), getOrderById);

// PHARMACIST
router.get("/pharmacy/my", protect, authorize("PHARMACIST"), getPharmacyOrders);

router.patch(
  "/pharmacy/:id/status",
  protect,
  authorize("PHARMACIST"),
  updateOrderStatus,
);

module.exports = router;
