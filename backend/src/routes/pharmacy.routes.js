const express = require("express");

const {
  createPharmacy,
  getMyPharmacy,
  updatePharmacy,
  searchMedicineNearby,
  getApprovedPharmacies,
  getPharmacistSalesStats,
  getPharmacyDetails,
  getPharmacyMedicines,
} = require("../controllers/pharmacy.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// CUSTOMER / PUBLIC
router.get("/", getApprovedPharmacies);
router.get("/search-medicine", searchMedicineNearby);

// PHARMACIST
router.post("/", protect, authorize("PHARMACIST"), createPharmacy);
router.get("/my", protect, authorize("PHARMACIST"), getMyPharmacy);
router.put("/my", protect, authorize("PHARMACIST"), updatePharmacy);
router.get("/sales/stats", protect, authorize("PHARMACIST"), getPharmacistSalesStats);

// SPECIFIC PHARMACY
router.get("/:id", getPharmacyDetails);
router.get("/:id/medicines", getPharmacyMedicines);

module.exports = router;
