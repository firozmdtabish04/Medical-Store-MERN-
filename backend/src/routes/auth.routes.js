const express = require("express");

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/auth.controller");

const protect = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

module.exports = router;
