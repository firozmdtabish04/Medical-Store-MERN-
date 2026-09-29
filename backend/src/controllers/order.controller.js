const Order = require("../models/Order");
const { createOrder } = require("../services/order.service");

// CUSTOMER
const placeOrder = async (req, res, next) => {
  try {
    const { pharmacyId, items, deliveryAddress, paymentMethod } = req.body;

    if (!pharmacyId) {
      return res.status(400).json({
        success: false,
        message: "Pharmacy is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one medicine is required",
      });
    }

    const order = await createOrder({
      customerId: req.user._id,
      pharmacyId,
      items,
      deliveryAddress,
      paymentMethod,
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email phone")
      .populate("pharmacy", "storeName phone address")
      .populate("items.medicine", "name genericName brandName");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// CUSTOMER
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("pharmacy", "storeName phone address")
      .populate("items.medicine", "name genericName brandName")
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

// CUSTOMER
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    })
      .populate("pharmacy", "storeName phone address")
      .populate("deliveryPartner", "name phone")
      .populate("items.medicine", "name genericName brandName");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// PHARMACIST
const getPharmacyOrders = async (req, res, next) => {
  try {
    const Pharmacy = require("../models/Pharmacy");

    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const orders = await Order.find({
      pharmacy: pharmacy._id,
    })
      .populate("customer", "name email phone")
      .populate("items.medicine", "name genericName brandName")
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

// PHARMACIST
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "PHARMACY_ACCEPTED",
      "REJECTED",
      "PACKING",
      "READY_FOR_PICKUP",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const Pharmacy = require("../models/Pharmacy");

    const pharmacy = await Pharmacy.findOne({
      owner: req.user._id,
    });

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      pharmacy: pharmacy._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

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

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getPharmacyOrders,
  updateOrderStatus,
};
