const crypto = require("crypto");

const Order = require("../models/Order");
const Payment = require("../models/Payment");

const { createRazorpayOrder } = require("../services/payment.service");

// ==========================================
// CREATE RAZORPAY PAYMENT
// ==========================================

const createPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "SUCCESS") {
      return res.status(400).json({
        success: false,
        message: "Order is already paid",
      });
    }

    const razorpayOrder = await createRazorpayOrder({
      amount: order.totalAmount,
      receipt: order._id.toString(),
    });

    const payment = await Payment.create({
      order: order._id,
      customer: req.user._id,
      amount: order.totalAmount,
      provider: "RAZORPAY",
      orderId: razorpayOrder.id,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Payment order created",
      payment: {
        id: payment._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// VERIFY PAYMENT
// ==========================================

const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const payment = await Payment.findOne({
      orderId: razorpay_order_id,
      customer: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    payment.paymentId = razorpay_payment_id;
    payment.status = "SUCCESS";

    await payment.save();

    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (order) {
      order.paymentStatus = "SUCCESS";
      await order.save();
    }

    res.json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// COD PAYMENT
// ==========================================

const createCODPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      customer: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const payment = await Payment.create({
      order: order._id,
      customer: req.user._id,
      amount: order.totalAmount,
      provider: "COD",
      status: "PENDING",
    });

    order.paymentStatus = "PENDING";

    await order.save();

    res.status(201).json({
      success: true,
      message: "Cash on Delivery selected",
      payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPayment,
  verifyPayment,
  createCODPayment,
};
