const express = require("express");

const {
  createPharmacy,
  getMyPharmacy,
  updatePharmacy,
  searchMedicineNearby,
} = require("../controllers/pharmacy.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// =====================================================
// CUSTOMER
// =====================================================

// Search medicine in nearby pharmacies
router.get("/search-medicine", searchMedicineNearby);

// =====================================================
// PHARMACIST
// =====================================================

// Create pharmacy
router.post("/", protect, authorize("PHARMACIST"), createPharmacy);

// Get my pharmacy
router.get("/my", protect, authorize("PHARMACIST"), getMyPharmacy);

// Update my pharmacy
router.put("/my", protect, authorize("PHARMACIST"), updatePharmacy);

module.exports = router;
