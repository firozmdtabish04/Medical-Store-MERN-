const sendNotification = require("../services/notification.service");

const testNotification = async (req, res, next) => {
  try {
    const notification = await sendNotification({
      userId: req.user._id,
      title: "MediFind",
      message: "Test notification",
      type: "TEST",
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
  testNotification,
};
