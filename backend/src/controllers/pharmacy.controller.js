const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");
const PharmacyMedicine = require("../models/PharmacyMedicine");
// =====================================================
// CREATE PHARMACY
// =====================================================

const createPharmacy = async (req, res, next) => {
  try {
    const {
      storeName,
      phone,
      address,
      coordinates,
      openingTime,
      closingTime,
      licenseNumber,
      licenseDocument,
    } = req.body;

    if (
      !storeName ||
      !phone ||
      !address ||
      !coordinates ||
      !openingTime ||
      !closingTime ||
      !licenseNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingPharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (existingPharmacy) {
      return res.status(409).json({
        success: false,
        message: "You already have a pharmacy",
      });
    }

    const existingLicense = await Pharmacy.findOne({
      licenseNumber,
    });

    if (existingLicense) {
      return res.status(409).json({
        success: false,
        message: "License number already registered",
      });
    }

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Coordinates must be [longitude, latitude]",
      });
    }

    const pharmacy = await Pharmacy.create({
      owner: req.user._id,

      storeName,
      phone,

      address,

      location: {
        type: "Point",
        coordinates,
      },

      openingTime,
      closingTime,

      licenseNumber,

      licenseDocument,

      approvalStatus: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Pharmacy registration submitted successfully",
      pharmacy,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET MY PHARMACY
// =====================================================

const getMyPharmacy = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    }).populate("owner", "name email phone role");

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.json({
      success: true,
      pharmacy,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// CHECK STORE OPEN / CLOSED
// =====================================================

const getStoreOpenStatus = (openingTime, closingTime) => {
  const now = new Date();

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [openHour, openMinute] = openingTime.split(":").map(Number);

  const [closeHour, closeMinute] = closingTime.split(":").map(Number);

  const openMinutes = openHour * 60 + openMinute;

  const closeMinutes = closeHour * 60 + closeMinute;

  // Example: 09:00 -> 22:00
  if (openMinutes < closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  // Example: 22:00 -> 02:00
  return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
};

// =====================================================
// SEARCH MEDICINE IN NEARBY PHARMACIES
// =====================================================

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

const searchMedicineNearby = async (req, res, next) => {
  try {
    const { q, category, longitude, latitude, radius = 50000, limit = 100 } = req.query;

    const hasLocation =
      longitude !== undefined &&
      latitude !== undefined &&
      !Number.isNaN(Number(longitude)) &&
      !Number.isNaN(Number(latitude));

    const userLng = hasLocation ? Number(longitude) : null;
    const userLat = hasLocation ? Number(latitude) : null;

    let inventoryQuery = {
      isActive: true,
      status: { $ne: "OUT_OF_STOCK" },
      stock: { $gt: 0 },
    };

    // If search term provided, find all matching medicines across name, genericName, brandName, category
    if (q && q.trim() !== "") {
      const regex = { $regex: q.trim(), $options: "i" };
      const matchedMeds = await Medicine.find({
        $or: [
          { name: regex },
          { genericName: regex },
          { brandName: regex },
          { category: regex },
        ],
        isActive: true,
      }).select("_id");

      const medIds = matchedMeds.map((m) => m._id);
      inventoryQuery.medicine = { $in: medIds };
    }

    const inventories = await PharmacyMedicine.find(inventoryQuery)
      .populate("pharmacy")
      .populate("medicine");

    const stores = [];

    for (const inv of inventories) {
      const pharmacy = inv.pharmacy;
      const medicine = inv.medicine;

      if (!pharmacy || pharmacy.approvalStatus !== "APPROVED" || !pharmacy.isActive) {
        continue;
      }
      if (!medicine || !medicine.isActive) {
        continue;
      }

      // Filter by category if requested
      if (category && category !== "ALL") {
        const medCat = (medicine.category || "").toUpperCase();
        if (medCat !== category.toUpperCase()) {
          continue;
        }
      }

      let distanceKm = 0;
      if (hasLocation && pharmacy.location?.coordinates?.length === 2) {
        const [pharmLng, pharmLat] = pharmacy.location.coordinates;
        distanceKm = calculateDistance(userLat, userLng, pharmLat, pharmLng);
      }

      const discount = inv.discount || 0;
      const effectivePrice = inv.price - (inv.price * discount) / 100;

      let isOpen = false;
      try {
        isOpen = getStoreOpenStatus(pharmacy.openingTime, pharmacy.closingTime);
      } catch (err) {
        isOpen = true;
      }

      stores.push({
        inventoryId: inv._id,
        pharmacyId: pharmacy._id,
        medicineId: medicine._id,
        storeName: pharmacy.storeName,
        address: pharmacy.address,
        phone: pharmacy.phone,
        distance: distanceKm,
        distanceUnit: "km",
        openingTime: pharmacy.openingTime,
        closingTime: pharmacy.closingTime,
        storeStatus: isOpen ? "OPEN" : "CLOSED",
        isOpen,
        medicine: {
          _id: medicine._id,
          id: medicine._id,
          name: medicine.name,
          genericName: medicine.genericName,
          brandName: medicine.brandName,
          category: medicine.category,
          dosage: medicine.dosage,
          description: medicine.description,
          prescriptionRequired: medicine.prescriptionRequired,
        },
        price: inv.price,
        discount,
        effectivePrice: Number(effectivePrice.toFixed(2)),
        stock: inv.stock,
        stockStatus: inv.status,
      });
    }

    // Sort by distance if location provided, otherwise by effectivePrice
    if (hasLocation) {
      stores.sort((a, b) => a.distance - b.distance);
    } else {
      stores.sort((a, b) => a.effectivePrice - b.effectivePrice);
    }

    const limitedStores = stores.slice(0, Number(limit) || 100);

    res.json({
      success: true,
      search: q || "",
      count: limitedStores.length,
      stores: limitedStores,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE PHARMACY
// =====================================================

const updatePharmacy = async (req, res, next) => {
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

    const allowedFields = [
      "storeName",
      "phone",
      "address",
      "openingTime",
      "closingTime",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        pharmacy[field] = req.body[field];
      }
    });

    if (req.body.coordinates) {
      if (
        !Array.isArray(req.body.coordinates) ||
        req.body.coordinates.length !== 2
      ) {
        return res.status(400).json({
          success: false,
          message: "Coordinates must be [longitude, latitude]",
        });
      }

      pharmacy.location = {
        type: "Point",
        coordinates: req.body.coordinates,
      };
    }

    await pharmacy.save();

    res.json({
      success: true,
      message: "Pharmacy updated successfully",
      pharmacy,
    });
  } catch (error) {
    next(error);
  }
};
const getPharmacyDetails = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({
      _id: req.params.id,
      approvalStatus: "APPROVED",
      isActive: true,
    }).select(
      "storeName phone address location openingTime closingTime licenseNumber",
    );

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const now = new Date();

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMinute] = pharmacy.openingTime.split(":").map(Number);

    const [closeHour, closeMinute] = pharmacy.closingTime
      .split(":")
      .map(Number);

    const openingMinutes = openHour * 60 + openMinute;
    const closingMinutes = closeHour * 60 + closeMinute;

    const isOpen =
      currentMinutes >= openingMinutes && currentMinutes <= closingMinutes;

    res.json({
      success: true,
      pharmacy: {
        ...pharmacy.toObject(),
        isOpen,
      },
    });
  } catch (error) {
    next(error);
  }
};
const getPharmacyMedicines = async (req, res, next) => {
  try {
    const pharmacy = await Pharmacy.findOne({
      _id: req.params.id,
      approvalStatus: "APPROVED",
      isActive: true,
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
      status: { $ne: "OUT_OF_STOCK" },
    })
      .populate(
        "medicine",
        "name genericName brandName category dosage description image prescriptionRequired",
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      pharmacy: {
        id: pharmacy._id,
        storeName: pharmacy.storeName,
      },
      count: inventory.length,
      medicines: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET APPROVED PHARMACIES (PUBLIC / CUSTOMER)
// =====================================================

const getApprovedPharmacies = async (req, res, next) => {
  try {
    const { search, city } = req.query;

    const query = {
      approvalStatus: "APPROVED",
      isActive: true,
    };

    if (search && search.trim() !== "") {
      const regex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { storeName: regex },
        { "address.street": regex },
        { "address.city": regex },
      ];
    }

    if (city && city.trim() !== "") {
      query["address.city"] = { $regex: city.trim(), $options: "i" };
    }

    const pharmacies = await Pharmacy.find(query).sort({ storeName: 1 });

    const formattedPharmacies = pharmacies.map((p) => {
      let isOpen = false;
      try {
        isOpen = getStoreOpenStatus(p.openingTime, p.closingTime);
      } catch (err) {
        isOpen = true;
      }

      return {
        ...p.toObject(),
        isOpen,
      };
    });

    res.json({
      success: true,
      count: formattedPharmacies.length,
      pharmacies: formattedPharmacies,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET PHARMACIST SALES & STATS
// =====================================================

const getPharmacistSalesStats = async (req, res, next) => {
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

    const Order = require("../models/Order");

    const orders = await Order.find({ pharmacy: pharmacy._id })
      .populate("customer", "name email phone")
      .populate("items.medicine", "name")
      .sort({ createdAt: -1 });

    let totalRevenue = 0;
    let todayRevenue = 0;
    let completedOrders = 0;
    let pendingOrders = 0;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    for (const order of orders) {
      if (order.orderStatus === "DELIVERED") {
        totalRevenue += order.totalAmount;
        completedOrders += 1;

        if (new Date(order.createdAt) >= startOfToday) {
          todayRevenue += order.totalAmount;
        }
      } else if (
        order.orderStatus !== "CANCELLED" &&
        order.orderStatus !== "REJECTED"
      ) {
        pendingOrders += 1;
      }
    }

    const totalMedicinesCount = await PharmacyMedicine.countDocuments({
      pharmacy: pharmacy._id,
      isActive: true,
    });

    const lowStockCount = await PharmacyMedicine.countDocuments({
      pharmacy: pharmacy._id,
      isActive: true,
      stock: { $lte: 10 },
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        todayRevenue,
        totalOrders: orders.length,
        completedOrders,
        pendingOrders,
        totalMedicines: totalMedicinesCount,
        lowStockMedicines: lowStockCount,
      },
      recentOrders: orders.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPharmacy,
  getMyPharmacy,
  updatePharmacy,
  searchMedicineNearby,
  getApprovedPharmacies,
  getPharmacistSalesStats,
  getPharmacyDetails,
  getPharmacyMedicines,
};
