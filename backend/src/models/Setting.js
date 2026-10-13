const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "MediFind Healthcare",
    },
    supportEmail: {
      type: String,
      default: "support@medifind.com",
    },
    supportPhone: {
      type: String,
      default: "+91 98765 43210",
    },
    freeDeliveryThreshold: {
      type: Number,
      default: 500,
    },
    standardDeliveryFee: {
      type: Number,
      default: 40,
    },
    deliveryPartnerPayout: {
      type: Number,
      default: 40,
    },
    taxPercentage: {
      type: Number,
      default: 5,
    },
    autoAssignDelivery: {
      type: Boolean,
      default: true,
    },
    allowCashOnDelivery: {
      type: Boolean,
      default: true,
    },
    allowOnlinePayments: {
      type: Boolean,
      default: true,
    },
    operationalStatus: {
      type: String,
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Setting", settingSchema);
