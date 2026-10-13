const Pharmacy = require("../models/Pharmacy");
const User = require("../models/User");
const Medicine = require("../models/Medicine");
const Order = require("../models/Order");
const Setting = require("../models/Setting");
const { getPlatformSettings } = require("../services/setting.service");

// ==========================================
// GET ADMIN DASHBOARD STATS
// ==========================================

const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalPharmacists,
      totalDeliveryPartners,
      totalPharmacies,
      pendingPharmacies,
      totalMedicines,
      totalOrders,
      ordersAggregate,
      recentOrders,
      recentPharmacies,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "CUSTOMER" }),
      User.countDocuments({ role: "PHARMACIST" }),
      User.countDocuments({ role: "DELIVERY" }),
      Pharmacy.countDocuments({ approvalStatus: "APPROVED" }),
      Pharmacy.countDocuments({ approvalStatus: "PENDING" }),
      Medicine.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            deliveredOrders: {
              $sum: { $cond: [{ $eq: ["$orderStatus", "DELIVERED"] }, 1, 0] },
            },
          },
        },
      ]),
      Order.find()
        .populate("customer", "name email")
        .populate("pharmacy", "storeName")
        .sort({ createdAt: -1 })
        .limit(5),
      Pharmacy.find()
        .populate("owner", "name email phone")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalRevenue =
      ordersAggregate.length > 0 ? ordersAggregate[0].totalRevenue : 0;
    const deliveredCount =
      ordersAggregate.length > 0 ? ordersAggregate[0].deliveredOrders : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCustomers,
        totalPharmacists,
        totalDeliveryPartners,
        totalPharmacies,
        pendingPharmacies,
        totalMedicines,
        totalOrders,
        deliveredCount,
        totalRevenue,
      },
      recentOrders,
      recentPharmacies,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL USERS (WITH SEARCH & FILTER)
// ==========================================

const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, status } = req.query;

    const query = {};

    if (role && role !== "ALL") {
      query.role = role.toUpperCase();
    }

    if (status && status !== "ALL") {
      query.isActive = status === "ACTIVE";
    }

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// TOGGLE USER STATUS (ACTIVE/INACTIVE)
// ==========================================

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET ALL PHARMACIES (ALL STATUSES)
// ==========================================

const getAllPharmacies = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = {};

    if (status && status !== "ALL") {
      query.approvalStatus = status.toUpperCase();
    }

    if (search && search.trim() !== "") {
      query.storeName = { $regex: search.trim(), $options: "i" };
    }

    const pharmacies = await Pharmacy.find(query)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

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

// ==========================================
// GET ALL ORDERS ACROSS PLATFORM
// ==========================================

const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = {};

    if (status && status !== "ALL") {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("customer", "name email phone")
      .populate("pharmacy", "storeName phone address")
      .populate("deliveryPartner", "name phone")
      .populate("items.medicine", "name dosage")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET DELIVERY PARTNERS WITH STATS
// ==========================================

const getDeliveryPartners = async (req, res, next) => {
  try {
    const settings = await getPlatformSettings();
    const feePerDelivery =
      settings.deliveryPartnerPayout || settings.standardDeliveryFee || 40;

    const partners = await User.find({ role: "DELIVERY" })
      .select("-password")
      .sort({ createdAt: -1 });

    // Aggregate delivery counts and fee earnings for partners
    const partnersWithStats = await Promise.all(
      partners.map(async (partner) => {
        const [activeCount, completedCount] = await Promise.all([
          Order.countDocuments({
            deliveryPartner: partner._id,
            orderStatus: {
              $in: ["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERY_ASSIGNED"],
            },
          }),
          Order.countDocuments({
            deliveryPartner: partner._id,
            orderStatus: "DELIVERED",
          }),
        ]);

        return {
          ...partner.toObject(),
          activeDeliveries: activeCount,
          completedDeliveries: completedCount,
          feePerDelivery,
          totalEarnings: completedCount * feePerDelivery,
        };
      }),
    );

    res.json({
      success: true,
      count: partnersWithStats.length,
      feePerDelivery,
      deliveryPartners: partnersWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// PLATFORM SETTINGS
// ==========================================

const getSettings = async (req, res, next) => {
  try {
    const settings = await getPlatformSettings();
    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (
      payload.standardDeliveryFee !== undefined &&
      payload.deliveryPartnerPayout === undefined
    ) {
      payload.deliveryPartnerPayout = payload.standardDeliveryFee;
    }

    const settings = await Setting.findOneAndUpdate({}, payload, {
      new: true,
      upsert: true,
    });

    res.json({
      success: true,
      message: "Platform settings updated successfully",
      settings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getAllPharmacies,
  getPendingPharmacies,
  approvePharmacy,
  rejectPharmacy,
  getAllOrders,
  getDeliveryPartners,
  getSettings,
  updateSettings,
};
