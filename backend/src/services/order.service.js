const mongoose = require("mongoose");

const Order = require("../models/Order");
const Pharmacy = require("../models/Pharmacy");
const PharmacyMedicine = require("../models/PharmacyMedicine");

const createOrder = async ({
  customerId,
  pharmacyId,
  items,
  deliveryAddress,
  paymentMethod = "COD",
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const pharmacy = await Pharmacy.findOne({
      _id: pharmacyId,
      approvalStatus: "APPROVED",
      isActive: true,
    }).session(session);

    if (!pharmacy) {
      throw new Error("Pharmacy not found or not approved");
    }

    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one medicine");
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const inventory = await PharmacyMedicine.findOne({
        _id: item.inventoryId,
        pharmacy: pharmacyId,
        isActive: true,
      })
        .populate("medicine")
        .session(session);

      if (!inventory) {
        throw new Error("Medicine inventory not found");
      }

      if (inventory.stock < item.quantity) {
        throw new Error(
          `${inventory.medicine.name} has only ${inventory.stock} items available`,
        );
      }

      const effectivePrice =
        inventory.price - (inventory.price * inventory.discount) / 100;

      const itemTotal = effectivePrice * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        medicine: inventory.medicine._id,
        quantity: item.quantity,
        price: inventory.price,
        discount: inventory.discount,
      });

      inventory.stock -= item.quantity;

      await inventory.save({ session });
    }

    const deliveryFee = subtotal >= 500 ? 0 : 40;

    const totalAmount = subtotal + deliveryFee;

    const order = await Order.create(
      [
        {
          customer: customerId,
          pharmacy: pharmacyId,
          items: orderItems,
          subtotal,
          deliveryFee,
          discount: 0,
          totalAmount,
          deliveryAddress,
          paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
          orderStatus: "PENDING",
        },
      ],
      { session },
    );

    await session.commitTransaction();

    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createOrder,
};
