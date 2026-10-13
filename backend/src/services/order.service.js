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
  // Check if transactions are supported
  let session = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch (err) {
    // If standalone MongoDB instance without replica set, proceed without transaction
    session = null;
    useTransaction = false;
  }

  try {
    const pharmacyQuery = Pharmacy.findOne({
      _id: pharmacyId,
      approvalStatus: "APPROVED",
      isActive: true,
    });
    if (useTransaction) pharmacyQuery.session(session);
    const pharmacy = await pharmacyQuery;

    if (!pharmacy) {
      throw new Error("Pharmacy not found or not approved");
    }

    if (!items || items.length === 0) {
      throw new Error("Order must contain at least one medicine");
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const invId = item.inventoryId || item._id || item.id || item.medicineId;
      
      let inventoryQuery = PharmacyMedicine.findOne({
        _id: invId,
        isActive: true,
      }).populate("medicine");
      if (useTransaction) inventoryQuery.session(session);
      let inventory = await inventoryQuery;

      // Fallback: If invId was actually the medicine ID
      if (!inventory) {
        let medQuery = PharmacyMedicine.findOne({
          medicine: invId,
          ...(pharmacyId ? { pharmacy: pharmacyId } : {}),
          isActive: true,
        }).populate("medicine");
        if (useTransaction) medQuery.session(session);
        inventory = await medQuery;
      }

      if (!inventory) {
        throw new Error("Medicine inventory not found");
      }

      if (!pharmacyId && inventory.pharmacy) {
        pharmacyId = inventory.pharmacy;
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

      if (useTransaction) {
        await inventory.save({ session });
      } else {
        await inventory.save();
      }
    }

    const deliveryFee = subtotal >= 500 ? 0 : 40;
    const totalAmount = subtotal + deliveryFee;

    const orderPayload = {
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
    };

    let order;
    if (useTransaction) {
      const created = await Order.create([orderPayload], { session });
      await session.commitTransaction();
      order = created[0];
    } else {
      order = await Order.create(orderPayload);
    }

    return order;
  } catch (error) {
    if (useTransaction && session) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
};

module.exports = {
  createOrder,
};
