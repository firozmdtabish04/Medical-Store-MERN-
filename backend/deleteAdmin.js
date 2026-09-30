require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/User");

const deleteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const result = await User.deleteOne({
      email: "admin@medifind.com",
      role: "ADMIN",
    });

    if (result.deletedCount === 0) {
      console.log("Admin not found");
    } else {
      console.log("Admin deleted successfully");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Delete failed:", error.message);
    process.exit(1);
  }
};

deleteAdmin();
