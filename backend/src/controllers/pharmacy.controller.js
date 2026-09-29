const Pharmacy = require("../models/Pharmacy");
const Medicine = require("../models/Medicine");

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

const searchMedicineNearby = async (req, res, next) => {
  try {
    const { q, longitude, latitude, radius = 5000, limit = 5 } = req.query;

    // -----------------------------------------------
    // Validate search
    // -----------------------------------------------

    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Medicine search query is required",
      });
    }

    // -----------------------------------------------
    // Validate location
    // -----------------------------------------------

    if (longitude === undefined || latitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude are required",
      });
    }

    const longitudeNumber = Number(longitude);
    const latitudeNumber = Number(latitude);

    if (Number.isNaN(longitudeNumber) || Number.isNaN(latitudeNumber)) {
      return res.status(400).json({
        success: false,
        message: "Longitude and latitude must be valid numbers",
      });
    }

    if (
      longitudeNumber < -180 ||
      longitudeNumber > 180 ||
      latitudeNumber < -90 ||
      latitudeNumber > 90
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid coordinates",
      });
    }

    // -----------------------------------------------
    // Radius and limit
    // -----------------------------------------------

    const radiusNumber = Math.min(Number(radius) || 5000, 20000);

    const limitNumber = Math.min(Number(limit) || 5, 20);

    // -----------------------------------------------
    // Find medicine
    // -----------------------------------------------

    const medicine = await Medicine.findOne({
      $or: [
        {
          name: {
            $regex: q.trim(),
            $options: "i",
          },
        },
        {
          genericName: {
            $regex: q.trim(),
            $options: "i",
          },
        },
        {
          brandName: {
            $regex: q.trim(),
            $options: "i",
          },
        },
      ],

      isActive: true,
    });

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    // -----------------------------------------------
    // Find nearby approved pharmacies
    // -----------------------------------------------

    const pharmacies = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitudeNumber, latitudeNumber],
          },

          distanceField: "distance",

          maxDistance: radiusNumber,

          spherical: true,

          query: {
            approvalStatus: "APPROVED",
            isActive: true,
          },
        },
      },

      // -------------------------------------------
      // Find medicine inventory
      // -------------------------------------------

      {
        $lookup: {
          from: "pharmacymedicines",

          let: {
            pharmacyId: "$_id",
          },

          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$pharmacy", "$$pharmacyId"],
                    },

                    {
                      $eq: ["$medicine", medicine._id],
                    },

                    {
                      $eq: ["$isActive", true],
                    },

                    {
                      $ne: ["$status", "OUT_OF_STOCK"],
                    },
                  ],
                },
              },
            },
          ],

          as: "inventory",
        },
      },

      // -------------------------------------------
      // Only pharmacies having medicine
      // -------------------------------------------

      {
        $match: {
          "inventory.0": {
            $exists: true,
          },
        },
      },

      // -------------------------------------------
      // One inventory item
      // -------------------------------------------

      {
        $unwind: "$inventory",
      },

      // -------------------------------------------
      // Select fields
      // -------------------------------------------

      {
        $project: {
          _id: 1,
          storeName: 1,
          phone: 1,
          address: 1,
          location: 1,
          openingTime: 1,
          closingTime: 1,
          distance: 1,
          inventory: 1,
        },
      },

      {
        $limit: limitNumber,
      },
    ]);

    // -----------------------------------------------
    // Format response
    // -----------------------------------------------

    const stores = pharmacies.map((pharmacy) => {
      const inventory = pharmacy.inventory;

      const distanceKm = pharmacy.distance / 1000;

      const discount = inventory.discount || 0;

      const effectivePrice =
        inventory.price - (inventory.price * discount) / 100;

      const isOpen = getStoreOpenStatus(
        pharmacy.openingTime,
        pharmacy.closingTime,
      );

      return {
        pharmacyId: pharmacy._id,

        storeName: pharmacy.storeName,

        address: pharmacy.address,

        phone: pharmacy.phone,

        distance: Number(distanceKm.toFixed(2)),

        distanceUnit: "km",

        openingTime: pharmacy.openingTime,

        closingTime: pharmacy.closingTime,

        storeStatus: isOpen ? "OPEN" : "CLOSED",

        isOpen,

        medicine: {
          id: medicine._id,

          name: medicine.name,

          genericName: medicine.genericName,

          brandName: medicine.brandName,

          dosage: medicine.dosage,
        },

        price: inventory.price,

        discount,

        effectivePrice: Number(effectivePrice.toFixed(2)),

        stock: inventory.stock,

        stockStatus: inventory.status,
      };
    });

    res.json({
      success: true,

      search: q,

      location: {
        longitude: longitudeNumber,

        latitude: latitudeNumber,
      },

      radius: radiusNumber,

      count: stores.length,

      stores,
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

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createPharmacy,
  getMyPharmacy,
  updatePharmacy,
  searchMedicineNearby,
};
