const express = require("express");

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  testNotification,
} = require("../controllers/notification.controller");

const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getNotifications);
router.put("/mark-all-read", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotification);
router.post("/test", testNotification);

module.exports = router;
