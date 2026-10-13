const Notification = require("../models/Notification");
const { getIO } = require("../sockets/socket");

const sendNotification = async ({
  userId,
  title,
  message,
  type = "INFO",
  data = {},
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      data,
      read: false,
    });

    // Real-time emit if Socket.IO is configured
    const io = getIO();
    if (io) {
      io.to(`user:${userId}`).emit("notification-received", notification);
    }

    return notification;
  } catch (error) {
    console.error("Failed to persist notification:", error);
    return null;
  }
};

const notifyOrderPlaced = async (order) => {
  return sendNotification({
    userId: order.customer,
    title: "Order Placed Successfully",
    message: `Your medicine order #${order._id.toString().slice(-6)} has been placed.`,
    type: "ORDER_PLACED",
    data: {
      orderId: order._id,
    },
  });
};

const notifyOrderAccepted = async (order) => {
  return sendNotification({
    userId: order.customer,
    title: "Order Accepted by Pharmacy",
    message: "The pharmacy has accepted and is packing your prescription.",
    type: "ORDER_ACCEPTED",
    data: {
      orderId: order._id,
    },
  });
};

const notifyDeliveryAssigned = async (order) => {
  return sendNotification({
    userId: order.customer,
    title: "Delivery Partner Assigned",
    message: "A courier partner has picked up your medicine parcel.",
    type: "DELIVERY_ASSIGNED",
    data: {
      orderId: order._id,
      deliveryPartner: order.deliveryPartner,
      estimatedDeliveryTime: order.estimatedDeliveryTime,
    },
  });
};

const notifyDelivered = async (order) => {
  return sendNotification({
    userId: order.customer,
    title: "Order Delivered",
    message: "Your medicine parcel has been successfully delivered.",
    type: "ORDER_DELIVERED",
    data: {
      orderId: order._id,
    },
  });
};

module.exports = {
  sendNotification,
  notifyOrderPlaced,
  notifyOrderAccepted,
  notifyDeliveryAssigned,
  notifyDelivered,
};
