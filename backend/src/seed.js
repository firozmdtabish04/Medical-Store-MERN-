require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Medicine = require("./models/Medicine");
const Pharmacy = require("./models/Pharmacy");
const PharmacyMedicine = require("./models/PharmacyMedicine");

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medifind";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    const defaultPassword = await bcrypt.hash("Password@123", 12);

    // 1. Create or ensure Admin
    let admin = await User.findOne({ email: "admin@medifind.com" });
    if (!admin) {
      admin = await User.create({
        name: "Platform Administrator",
        email: "admin@medifind.com",
        phone: "+91 99999 00001",
        password: defaultPassword,
        role: "ADMIN",
        isActive: true,
      });
      console.log("Created Admin account: admin@medifind.com / Password@123");
    } else {
      admin.role = "ADMIN";
      admin.isActive = true;
      await admin.save();
      console.log("Admin account exists: admin@medifind.com");
    }

    // 2. Create Pharmacist
    let pharmacist = await User.findOne({ email: "pharmacist@medifind.com" });
    if (!pharmacist) {
      pharmacist = await User.create({
        name: "Dr. Rajesh Sharma",
        email: "pharmacist@medifind.com",
        phone: "+91 99999 00002",
        password: defaultPassword,
        role: "PHARMACIST",
        isActive: true,
      });
      console.log(
        "Created Pharmacist account: pharmacist@medifind.com / Password@123",
      );
    }

    // 3. Create Delivery Partner
    let deliveryPartner = await User.findOne({ email: "delivery@medifind.com" });
    if (!deliveryPartner) {
      deliveryPartner = await User.create({
        name: "Vikram Singh (Rider)",
        email: "delivery@medifind.com",
        phone: "+91 99999 00003",
        password: defaultPassword,
        role: "DELIVERY",
        isActive: true,
      });
      console.log(
        "Created Delivery account: delivery@medifind.com / Password@123",
      );
    }

    // 4. Create Customer
    let customer = await User.findOne({ email: "customer@medifind.com" });
    if (!customer) {
      customer = await User.create({
        name: "Rahul Verma",
        email: "customer@medifind.com",
        phone: "+91 99999 00004",
        password: defaultPassword,
        role: "CUSTOMER",
        isActive: true,
      });
      console.log(
        "Created Customer account: customer@medifind.com / Password@123",
      );
    }

    // 5. Seed Core Medicines
    const sampleMedicines = [
      {
        name: "Paracetamol 500mg",
        genericName: "Acetaminophen",
        brandName: "Crocin Advance",
        category: "Pain Relief",
        dosage: "500mg",
        description:
          "Fast and effective relief from mild-to-moderate pain, headaches and fever reduction.",
        prescriptionRequired: false,
      },
      {
        name: "Amoxicillin 500mg",
        genericName: "Amoxicillin Trihydrate",
        brandName: "Mox 500",
        category: "Antibiotics",
        dosage: "500mg",
        description:
          "Broad-spectrum penicillin antibiotic used to treat various bacterial infections.",
        prescriptionRequired: true,
      },
      {
        name: "Cetirizine 10mg",
        genericName: "Cetirizine Hydrochloride",
        brandName: "Cetzine",
        category: "Allergy",
        dosage: "10mg",
        description:
          "Antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, and hives.",
        prescriptionRequired: false,
      },
      {
        name: "Azithromycin 500mg",
        genericName: "Azithromycin",
        brandName: "Azee 500",
        category: "Antibiotics",
        dosage: "500mg",
        description:
          "Macrolide-type antibiotic used to treat bacterial infections of lungs, skin, ears.",
        prescriptionRequired: true,
      },
      {
        name: "Pantoprazole 40mg",
        genericName: "Pantoprazole Sodium",
        brandName: "Pan 40",
        category: "Gastrointestinal",
        dosage: "40mg",
        description:
          "Proton pump inhibitor that decreases stomach acid, treating heartburn and ulcers.",
        prescriptionRequired: false,
      },
      {
        name: "Metformin 500mg",
        genericName: "Metformin Hydrochloride",
        brandName: "Glycomet 500",
        category: "Diabetes",
        dosage: "500mg",
        description:
          "Oral medication for managing blood sugar levels in type 2 diabetes patients.",
        prescriptionRequired: true,
      },
    ];

    const seededMedicines = [];
    for (const medData of sampleMedicines) {
      let med = await Medicine.findOne({ name: medData.name });
      if (!med) {
        med = await Medicine.create({ ...medData, isActive: true });
        console.log(`Seeded medicine: ${med.name}`);
      }
      seededMedicines.push(med);
    }

    // 6. Create Pharmacy for Dr. Rajesh
    let pharmacy = await Pharmacy.findOne({ owner: pharmacist._id });
    if (!pharmacy) {
      pharmacy = await Pharmacy.create({
        owner: pharmacist._id,
        storeName: "Apollo Care Pharmacy",
        phone: "+91 98765 12345",
        address: {
          street: "12, MG Road, Central Market",
          city: "New Delhi",
          state: "Delhi",
          pincode: "110001",
        },
        location: {
          type: "Point",
          coordinates: [77.209, 28.6139],
        },
        openingTime: "08:00",
        closingTime: "23:00",
        licenseNumber: "DL-PHARM-2026-09871",
        approvalStatus: "APPROVED",
        isActive: true,
      });
      console.log(`Created Pharmacy: ${pharmacy.storeName}`);
    }

    // 7. Seed inventory for this pharmacy
    for (const med of seededMedicines) {
      const existingInv = await PharmacyMedicine.findOne({
        pharmacy: pharmacy._id,
        medicine: med._id,
      });
      if (!existingInv) {
        await PharmacyMedicine.create({
          pharmacy: pharmacy._id,
          medicine: med._id,
          price: 95,
          discount: 10,
          stock: 45,
          lowStockThreshold: 10,
          status: "AVAILABLE",
          isActive: true,
        });
        console.log(`Added inventory for ${med.name} at ${pharmacy.storeName}`);
      }
    }

    console.log("=========================================");
    console.log("Database seeded successfully!");
    console.log("Login Credentials:");
    console.log("- Admin:      admin@medifind.com      / Password@123");
    console.log("- Pharmacist: pharmacist@medifind.com / Password@123");
    console.log("- Delivery:   delivery@medifind.com   / Password@123");
    console.log("- Customer:   customer@medifind.com   / Password@123");
    console.log("=========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDatabase();
