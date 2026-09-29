const express = require("express");

const {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  searchMedicines,
  addMedicineToPharmacy,
  getMyInventory,
  updateInventory,
  removeMedicineFromPharmacy,
} = require("../controllers/medicine.controller");

const protect = require("../middleware/auth");
const authorize = require("../middleware/role");

const router = express.Router();

// =====================================================
// MEDICINE MASTER
// =====================================================

// Create medicine
router.post("/", protect, authorize("ADMIN"), createMedicine);

// Get all medicines
router.get("/", getAllMedicines);

// Search medicine
router.get("/search", searchMedicines);

// Get medicine by ID
router.get("/:id", getMedicineById);

// =====================================================
// PHARMACY INVENTORY
// =====================================================

// Add medicine to pharmacy
router.post(
  "/inventory",
  protect,
  authorize("PHARMACIST"),
  addMedicineToPharmacy,
);

// Get pharmacist inventory
router.get("/inventory/my", protect, authorize("PHARMACIST"), getMyInventory);

// Update inventory
router.put("/inventory/:id", protect, authorize("PHARMACIST"), updateInventory);

// Remove medicine
router.delete(
  "/inventory/:id",
  protect,
  authorize("PHARMACIST"),
  removeMedicineFromPharmacy,
);

module.exports = router;
