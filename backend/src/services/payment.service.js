const Razorpay = require("razorpay");

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  console.log("Razorpay initialized");
} else {
  console.log("Razorpay credentials not configured. Payment gateway disabled.");
}

const createRazorpayOrder = async ({ amount, receipt }) => {
  if (!razorpay) {
    throw new Error(
      "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env",
    );
  }

  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt,
  };

  return await razorpay.orders.create(options);
};

module.exports = {
  createRazorpayOrder,
};
