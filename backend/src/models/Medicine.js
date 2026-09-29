const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    genericName: {
      type: String,
      trim: true,
    },

    brandName: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    dosage: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    prescriptionRequired: {
      type: Boolean,
      default: false,
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

medicineSchema.index({
  name: "text",
  genericName: "text",
  brandName: "text",
});

module.exports = mongoose.model("Medicine", medicineSchema);
