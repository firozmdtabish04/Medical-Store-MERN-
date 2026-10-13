const express = require("express");
const {
  getCart,
  syncCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
} = require("../controllers/cart.controller");
const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.post("/sync", syncCart);
router.post("/item", addItem);
router.put("/item", updateQuantity);
router.delete("/item/:inventoryId", removeItem);
router.delete("/", clearCart);

module.exports = router;
