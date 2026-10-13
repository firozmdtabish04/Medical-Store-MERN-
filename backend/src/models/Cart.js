const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  inventoryId: {
    type: String,
    required: true,
  },
  pharmacyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pharmacy",
  },
  storeName: {
    type: String,
    default: "Care Pharmacy",
  },
  medicine: {
    _id: String,
    name: String,
    genericName: String,
    brandName: String,
    category: String,
    dosageForm: String,
    strength: String,
    image: String,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  effectivePrice: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 100,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Cart", cartSchema);
