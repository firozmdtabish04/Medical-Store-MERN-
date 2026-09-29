const Medicine = require("../models/Medicine");
const Pharmacy = require("../models/Pharmacy");
const PharmacyMedicine = require("../models/PharmacyMedicine");

// =====================================================
// CREATE MEDICINE MASTER
// =====================================================

const createMedicine = async (req, res, next) => {
  try {
    const {
      name,
      genericName,
      brandName,
      category,
      dosage,
      description,
      prescriptionRequired,
      image,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: "Medicine name and category are required",
      });
    }

    const existingMedicine = await Medicine.findOne({
      name: {
        $regex: `^${name}$`,
        $options: "i",
      },
    });

    if (existingMedicine) {
      return res.status(409).json({
        success: false,
        message: "Medicine already exists",
      });
    }

    const medicine = await Medicine.create({
      name,
      genericName,
      brandName,
      category,
      dosage,
      description,
      prescriptionRequired,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      medicine,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL MEDICINES
// =====================================================

const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find({
      isActive: true,
    }).sort({
      name: 1,
    });

    res.json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SINGLE MEDICINE
// =====================================================

const getMedicineById = async (req, res, next) => {
  try {
    const medicine = await Medicine.findById(req.params.id);

    if (!medicine || !medicine.isActive) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.json({
      success: true,
      medicine,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// SEARCH MEDICINES
// =====================================================

const searchMedicines = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const medicines = await Medicine.find({
      $text: {
        $search: q,
      },

      isActive: true,
    }).limit(20);

    res.json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// ADD MEDICINE TO PHARMACY
// =====================================================

const addMedicineToPharmacy = async (req, res, next) => {
  try {
    const { medicineId, price, discount, stock, lowStockThreshold } = req.body;

    // ----------------------------------------------
    // Validate
    // ----------------------------------------------

    if (!medicineId || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Medicine, price and stock are required",
      });
    }

    // ----------------------------------------------
    // Find pharmacy owned by pharmacist
    // ----------------------------------------------

    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    // ----------------------------------------------
    // Check approval
    // ----------------------------------------------

    if (pharmacy.approvalStatus !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Pharmacy must be approved before adding medicines",
      });
    }

    // ----------------------------------------------
    // Check medicine
    // ----------------------------------------------

    const medicine = await Medicine.findById(medicineId);

    if (!medicine || !medicine.isActive) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // ----------------------------------------------
    // Check duplicate
    // ----------------------------------------------

    const existingInventory = await PharmacyMedicine.findOne({
      pharmacy: pharmacy._id,
      medicine: medicineId,
    });

    if (existingInventory) {
      return res.status(409).json({
        success: false,
        message: "Medicine already exists in your pharmacy",
      });
    }

    // ----------------------------------------------
    // Create inventory
    // ----------------------------------------------

    const pharmacyMedicine = await PharmacyMedicine.create({
      pharmacy: pharmacy._id,
      medicine: medicineId,
      price,
      discount: discount || 0,
      stock,
      lowStockThreshold: lowStockThreshold || 10,
    });

    const populatedInventory = await PharmacyMedicine.findById(
      pharmacyMedicine._id,
    )
      .populate("medicine")
      .populate("pharmacy");

    res.status(201).json({
      success: true,
      message: "Medicine added to pharmacy successfully",
      inventory: populatedInventory,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET MY PHARMACY INVENTORY
// =====================================================

const getMyInventory = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const inventory = await PharmacyMedicine.find({
      pharmacy: pharmacy._id,
      isActive: true,
    })
      .populate("medicine")
      .sort({
        createdAt: -1,
      });

    res.json({
      success: true,
      count: inventory.length,
      inventory,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE INVENTORY
// =====================================================

const updateInventory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { price, discount, stock, lowStockThreshold } = req.body;

    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const inventory = await PharmacyMedicine.findOne({
      _id: id,
      pharmacy: pharmacy._id,
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    if (price !== undefined) {
      inventory.price = price;
    }

    if (discount !== undefined) {
      inventory.discount = discount;
    }

    if (stock !== undefined) {
      inventory.stock = stock;
    }

    if (lowStockThreshold !== undefined) {
      inventory.lowStockThreshold = lowStockThreshold;
    }

    await inventory.save();

    const updatedInventory = await PharmacyMedicine.findById(
      inventory._id,
    ).populate("medicine");

    res.json({
      success: true,
      message: "Inventory updated successfully",
      inventory: updatedInventory,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// REMOVE MEDICINE FROM PHARMACY
// =====================================================

const removeMedicineFromPharmacy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const inventory = await PharmacyMedicine.findOne({
      _id: id,
      pharmacy: pharmacy._id,
    });

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: "Inventory item not found",
      });
    }

    inventory.isActive = false;

    await inventory.save();

    res.json({
      success: true,
      message: "Medicine removed from pharmacy",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMedicine,
  getAllMedicines,
  getMedicineById,
  searchMedicines,
  addMedicineToPharmacy,
  getMyInventory,
  updateInventory,
  removeMedicineFromPharmacy,
};
