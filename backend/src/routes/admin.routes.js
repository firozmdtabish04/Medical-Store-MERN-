const express = require("express");

const {
  getPendingPharmacies,
  approvePharmacy,
  rejectPharmacy,
} = require("../controllers/admin.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

router.get(
  "/pharmacies/pending",
  protect,
  authorize("ADMIN"),
  getPendingPharmacies,
);

router.patch(
  "/pharmacies/:id/approve",
  protect,
  authorize("ADMIN"),
  approvePharmacy,
);

router.patch(
  "/pharmacies/:id/reject",
  protect,
  authorize("ADMIN"),
  rejectPharmacy,
);

module.exports = router;
