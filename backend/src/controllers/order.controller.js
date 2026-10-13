const Order = require("../models/Order");
const { createOrder } = require("../services/order.service");
const { emitToOrder } = require("../sockets/socket");

// CUSTOMER: PLACE ORDER
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

    emitToOrder(order._id, "order-status-updated", {
      orderId: order._id,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// CUSTOMER: GET MY ORDERS
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("pharmacy", "storeName phone address")
      .populate("deliveryPartner", "name phone")
      .populate("items.medicine", "name genericName brandName dosage")
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

// CUSTOMER: GET SINGLE ORDER BY ID
const getOrderById = async (req, res, next) => {
  try {
    // Customer can see their own order; pharmacist/delivery/admin can also view if authorized
    const query = { _id: req.params.id };
    if (req.user.role === "CUSTOMER") {
      query.customer = req.user._id;
    }

    const order = await Order.findOne(query)
      .populate("customer", "name email phone")
      .populate("pharmacy", "storeName phone address location")
      .populate("deliveryPartner", "name phone")
      .populate("items.medicine", "name genericName brandName dosage image");

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

// CUSTOMER: CANCEL ORDER (IF STILL PENDING)
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is already confirmed or processing",
      });
    }

    order.orderStatus = "CANCELLED";
    await order.save();

    // Restock items
    const PharmacyMedicine = require("../models/PharmacyMedicine");
    for (const item of order.items) {
      await PharmacyMedicine.updateOne(
        { pharmacy: order.pharmacy, medicine: item.medicine },
        { $inc: { stock: item.quantity } },
      );
    }

    emitToOrder(order._id, "order-status-updated", {
      orderId: order._id,
      status: "CANCELLED",
    });

    res.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

// PHARMACIST: GET ORDERS FOR PHARMACY
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
      .populate("deliveryPartner", "name phone")
      .populate("items.medicine", "name genericName brandName dosage")
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

// PHARMACIST: UPDATE ORDER STATUS
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

    if (status === "REJECTED") {
      // Restock items
      const PharmacyMedicine = require("../models/PharmacyMedicine");
      for (const item of order.items) {
        await PharmacyMedicine.updateOne(
          { pharmacy: order.pharmacy, medicine: item.medicine },
          { $inc: { stock: item.quantity } },
        );
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

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getPharmacyOrders,
  updateOrderStatus,
};
