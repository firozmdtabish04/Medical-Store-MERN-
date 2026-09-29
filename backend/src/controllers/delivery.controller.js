const Order = require("../models/Order");
const User = require("../models/User");

const { assignDeliveryPartner } = require("../services/delivery.service");

// ==========================================
// AVAILABLE ORDERS
// ==========================================

const getAvailableDeliveries = async (req, res, next) => {
  try {
    const orders = await Order.find({
      orderStatus: "READY_FOR_PICKUP",
      deliveryPartner: null,
    })
      .populate("customer", "name phone")
      .populate("pharmacy", "storeName phone address location")
      .sort({ createdAt: 1 });

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
// ACCEPT DELIVERY
// ==========================================

const acceptDelivery = async (req, res, next) => {
  try {
    const order = await assignDeliveryPartner(req.params.id, req.user._id);

    res.json({
      success: true,
      message: "Delivery accepted",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE DELIVERY STATUS
// ==========================================

const updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["PICKED_UP", "OUT_FOR_DELIVERY", "DELIVERED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery status",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      deliveryPartner: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Delivery order not found",
      });
    }

    order.orderStatus = status;

    if (status === "DELIVERED") {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// MY DELIVERIES
// ==========================================

const getMyDeliveries = async (req, res, next) => {
  try {
    const orders = await Order.find({
      deliveryPartner: req.user._id,
    })
      .populate("customer", "name phone")
      .populate("pharmacy", "storeName phone address location")
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

module.exports = {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getMyDeliveries,
};
