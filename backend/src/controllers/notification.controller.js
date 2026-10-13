const Notification = require("../models/Notification");
const { sendNotification } = require("../services/notification.service");

// GET ALL NOTIFICATIONS FOR LOGGED IN USER
const getNotifications = async (req, res, next) => {
  try {
    let notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    // If new user with no notifications, seed friendly initial records in DB
    if (notifications.length === 0) {
      const initialSeed = [
        {
          user: req.user._id,
          title: "Welcome to MediFind",
          message:
            "Find genuine medicines, check store stocks, and track orders in real time.",
          type: "SYSTEM",
          read: false,
        },
        {
          user: req.user._id,
          title: "Prescription Network Active",
          message:
            "Verified pharmacies around you are online and ready to dispense.",
          type: "INFO",
          read: false,
        },
        {
          user: req.user._id,
          title: "Express Medicine Delivery",
          message: "Order by 8 PM for lightning fast doorstep courier delivery.",
          type: "INFO",
          read: true,
        },
      ];

      notifications = await Notification.insertMany(initialSeed);
    }

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// MARK SINGLE NOTIFICATION AS READ
const markNotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// MARK ALL AS READ
const markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE NOTIFICATION
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    next(error);
  }
};

// TEST NOTIFICATION
const testNotification = async (req, res, next) => {
  try {
    const notification = await sendNotification({
      userId: req.user._id,
      title: "MediFind Test Alert",
      message: "This is a real-time test notification stored in MongoDB.",
      type: "SYSTEM",
    });

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  testNotification,
};
