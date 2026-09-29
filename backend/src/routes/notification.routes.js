const express = require("express");

const { testNotification } = require("../controllers/notification.controller");

const protect = require("../middleware/auth");

const router = express.Router();

router.post("/test", protect, testNotification);

module.exports = router;
