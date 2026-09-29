const Order = require("../models/Order");

const assignDeliveryPartner = async (orderId, deliveryPartnerId) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.orderStatus !== "READY_FOR_PICKUP") {
    throw new Error("Order is not ready for delivery");
  }

  order.deliveryPartner = deliveryPartnerId;

  order.orderStatus = "DELIVERY_ASSIGNED";

  order.deliveryAssignedAt = new Date();

  // Estimated delivery: 30 minutes
  order.estimatedDeliveryTime = 30;

  await order.save();

  return order;
};

module.exports = {
  assignDeliveryPartner,
};
