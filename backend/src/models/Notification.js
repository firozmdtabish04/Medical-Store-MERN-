const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "SYSTEM",
        "ORDER_PLACED",
        "ORDER_ACCEPTED",
        "DELIVERY_ASSIGNED",
        "ORDER_DELIVERED",
        "ORDER_CANCELLED",
        "INFO",
      ],
      default: "INFO",
    },
    data: {
      type: Object,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Notification", notificationSchema);
