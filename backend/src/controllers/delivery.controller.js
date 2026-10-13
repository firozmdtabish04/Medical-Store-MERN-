const Order = require("../models/Order");
const User = require("../models/User");
const { assignDeliveryPartner } = require("../services/delivery.service");
const { emitToOrder } = require("../sockets/socket");

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
      .populate("items.medicine", "name")
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

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name phone")
      .populate("pharmacy", "storeName phone address location")
      .populate("items.medicine", "name");

    emitToOrder(order._id, "order-status-updated", {
      orderId: order._id,
      status: "DELIVERY_ASSIGNED",
    });

    res.json({
      success: true,
      message: "Delivery accepted",
      order: populatedOrder,
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
      // If payment was COD and now delivered, mark payment SUCCESS
      if (order.paymentStatus === "PENDING") {
        order.paymentStatus = "SUCCESS";
      }
    }

    await order.save();

    emitToOrder(order._id, "order-status-updated", {
      orderId: order._id,
      status,
    });

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
// GET ACTIVE DELIVERY
// ==========================================

const getActiveDelivery = async (req, res, next) => {
  try {
    const activeOrder = await Order.findOne({
      deliveryPartner: req.user._id,
      orderStatus: {
        $in: ["DELIVERY_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"],
      },
    })
      .populate("customer", "name phone")
      .populate("pharmacy", "storeName phone address location")
      .populate("items.medicine", "name dosage brandName")
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      order: activeOrder,
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
      .populate("items.medicine", "name")
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
// GET DELIVERY PARTNER STATS
// ==========================================

const getDeliveryStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      availableCount,
      activeOrder,
      completedTodayCount,
      allCompletedOrders,
    ] = await Promise.all([
      Order.countDocuments({
        orderStatus: "READY_FOR_PICKUP",
        deliveryPartner: null,
      }),
      Order.findOne({
        deliveryPartner: req.user._id,
        orderStatus: {
          $in: ["DELIVERY_ASSIGNED", "PICKED_UP", "OUT_FOR_DELIVERY"],
        },
      }),
      Order.countDocuments({
        deliveryPartner: req.user._id,
        orderStatus: "DELIVERED",
        deliveredAt: { $gte: startOfToday },
      }),
      Order.countDocuments({
        deliveryPartner: req.user._id,
        orderStatus: "DELIVERED",
      }),
    ]);

    // ₹60 earning per completed delivery
    const earningsPerDelivery = 60;
    const todayEarnings = completedTodayCount * earningsPerDelivery;
    const totalEarnings = allCompletedOrders * earningsPerDelivery;

    res.json({
      success: true,
      stats: {
        availableDeliveries: availableCount,
        hasActiveDelivery: !!activeOrder,
        completedToday: completedTodayCount,
        totalCompleted: allCompletedOrders,
        todayEarnings,
        totalEarnings,
      },
      activeOrderId: activeOrder ? activeOrder._id : null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableDeliveries,
  acceptDelivery,
  updateDeliveryStatus,
  getActiveDelivery,
  getMyDeliveries,
  getDeliveryStats,
};
