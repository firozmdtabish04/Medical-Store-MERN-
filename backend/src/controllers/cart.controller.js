const Cart = require("../models/Cart");

// GET USER CART
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      items: cart.items || [],
    });
  } catch (error) {
    next(error);
  }
};

// SYNC FULL CART (Used to save entire cart state)
const syncCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { new: true, upsert: true },
    );

    res.json({
      success: true,
      items: cart.items || [],
    });
  } catch (error) {
    next(error);
  }
};

// ADD ITEM TO CART
const addItem = async (req, res, next) => {
  try {
    const item = req.body;
    if (!item.inventoryId) {
      return res.status(400).json({
        success: false,
        message: "Inventory ID is required",
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (i) => i.inventoryId === item.inventoryId,
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity = Math.min(
        cart.items[existingIndex].quantity + (item.quantity || 1),
        item.stock || 99,
      );
    } else {
      cart.items.push(item);
    }

    await cart.save();

    res.json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE QUANTITY
const updateQuantity = async (req, res, next) => {
  try {
    const { inventoryId, quantity } = req.body;

    if (!inventoryId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Valid inventoryId and positive quantity required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((i) => i.inventoryId === inventoryId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not in cart",
      });
    }

    item.quantity = Math.min(quantity, item.stock || 99);
    await cart.save();

    res.json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    next(error);
  }
};

// REMOVE ITEM
const removeItem = async (req, res, next) => {
  try {
    const { inventoryId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { inventoryId } } },
      { new: true },
    );

    res.json({
      success: true,
      items: cart ? cart.items : [],
    });
  } catch (error) {
    next(error);
  }
};

// CLEAR CART
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { new: true, upsert: true },
    );

    res.json({
      success: true,
      message: "Cart cleared",
      items: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  syncCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
};
