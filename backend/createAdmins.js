require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const setupAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const email = "mdtabishfiroz04@gmail.com";
    const password = "Akhil@04";

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found");
      process.exit(1);
    }

    user.password = await bcrypt.hash(password, 12);
    user.role = "ADMIN";
    user.isActive = true;

    await user.save();

    console.log("Admin updated successfully");
    console.log("Email:", user.email);
    console.log("Password:", password);
    console.log("Role:", user.role);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed:", error.message);
    process.exit(1);
  }
};

setupAdmin();
