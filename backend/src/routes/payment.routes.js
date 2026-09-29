const express = require("express");

const {
  createPayment,
  verifyPayment,
  createCODPayment,
} = require("../controllers/payment.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

router.post("/create", protect, authorize("CUSTOMER"), createPayment);

router.post("/verify", protect, authorize("CUSTOMER"), verifyPayment);

router.post("/cod", protect, authorize("CUSTOMER"), createCODPayment);

module.exports = router;
