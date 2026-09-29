const sendNotification = async ({
  userId,
  title,
  message,
  type,
  data = {},
}) => {
  console.log("=================================");
  console.log("NOTIFICATION");
  console.log("User:", userId);
  console.log("Title:", title);
  console.log("Message:", message);
  console.log("Type:", type);
  console.log("Data:", data);
  console.log("=================================");

  return {
    success: true,
    userId,
    title,
    message,
    type,
    data,
  };
};

const notifyOrderPlaced = async (order) => {
  return sendNotification({
    userId: order.customer,
    title: "Order Placed",
    message: "Your medicine order has been placed.",
    type: "ORDER_PLACED",
    data: {
      orderId: order._id,
    },
  });
};

const notifyOrderAccepted = async (order) => {
  return sendNotification({
    userId: order.customer,
    title: "Order Accepted",
    message: "The pharmacy has accepted your order.",
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
    message: "A delivery partner has been assigned to your order.",
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
    message: "Your medicine order has been delivered.",
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
