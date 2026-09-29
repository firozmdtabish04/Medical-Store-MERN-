const Pharmacy = require("../models/Pharmacy");

// ==========================================
// GET PENDING PHARMACIES
// ==========================================

const getPendingPharmacies = async (req, res, next) => {
  try {
    const pharmacies = await Pharmacy.find({
      approvalStatus: "PENDING",
    }).populate("owner", "name email phone");

    res.json({
      success: true,
      count: pharmacies.length,
      pharmacies,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// APPROVE PHARMACY
// ==========================================

const approvePharmacy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const pharmacy = await Pharmacy.findById(id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    pharmacy.approvalStatus = "APPROVED";
    pharmacy.rejectionReason = null;

    await pharmacy.save();

    res.json({
      success: true,
      message: "Pharmacy approved successfully",
      pharmacy,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// REJECT PHARMACY
// ==========================================

const rejectPharmacy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const pharmacy = await Pharmacy.findById(id);

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    pharmacy.approvalStatus = "REJECTED";
    pharmacy.rejectionReason = reason || "Pharmacy registration rejected";

    await pharmacy.save();

    res.json({
      success: true,
      message: "Pharmacy rejected",
      pharmacy,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingPharmacies,
  approvePharmacy,
  rejectPharmacy,
};
