const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getPharmacyOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// CUSTOMER
router.post("/", protect, authorize("CUSTOMER"), placeOrder);
router.get("/my", protect, authorize("CUSTOMER"), getMyOrders);
router.patch("/:id/cancel", protect, authorize("CUSTOMER"), cancelOrder);

// PHARMACIST
router.get("/pharmacy", protect, authorize("PHARMACIST"), getPharmacyOrders);
router.get("/pharmacy/my", protect, authorize("PHARMACIST"), getPharmacyOrders);
router.patch(
  "/pharmacy/:id/status",
  protect,
  authorize("PHARMACIST"),
  updateOrderStatus,
);

// SINGLE ORDER (Customer, Pharmacist, Delivery, Admin)
router.get("/:id", protect, getOrderById);

module.exports = router;
