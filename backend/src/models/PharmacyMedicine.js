const mongoose = require("mongoose");

const pharmacyMedicineSchema = new mongoose.Schema(
  {
    pharmacy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy",
      required: true,
    },

    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 1,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "LOW_STOCK", "OUT_OF_STOCK"],
      default: "OUT_OF_STOCK",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// One medicine can only have one inventory entry
// for a particular pharmacy.
pharmacyMedicineSchema.index(
  {
    pharmacy: 1,
    medicine: 1,
  },
  {
    unique: true,
  },
);

// Automatically calculate stock status
pharmacyMedicineSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.status = "OUT_OF_STOCK";
  } else if (this.stock <= this.lowStockThreshold) {
    this.status = "LOW_STOCK";
  } else {
    this.status = "AVAILABLE";
  }

  next();
});

module.exports = mongoose.model("PharmacyMedicine", pharmacyMedicineSchema);
