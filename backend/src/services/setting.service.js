const Setting = require("../models/Setting");

const getPlatformSettings = async () => {
  try {
    let setting = await Setting.findOne();
    if (!setting) {
      setting = await Setting.create({
        platformName: "MediFind Healthcare",
        supportEmail: "support@medifind.com",
        supportPhone: "+91 98765 43210",
        freeDeliveryThreshold: 500,
        standardDeliveryFee: 40,
        deliveryPartnerPayout: 40,
        taxPercentage: 5,
        autoAssignDelivery: true,
        allowCashOnDelivery: true,
        allowOnlinePayments: true,
        operationalStatus: "ACTIVE",
      });
    }
    return setting;
  } catch (error) {
    console.error("Error fetching platform settings from database:", error);
    // Fallback defaults
    return {
      platformName: "MediFind Healthcare",
      supportEmail: "support@medifind.com",
      supportPhone: "+91 98765 43210",
      freeDeliveryThreshold: 500,
      standardDeliveryFee: 40,
      deliveryPartnerPayout: 40,
      taxPercentage: 5,
      autoAssignDelivery: true,
      allowCashOnDelivery: true,
      allowOnlinePayments: true,
      operationalStatus: "ACTIVE",
    };
  }
};

module.exports = {
  getPlatformSettings,
};
