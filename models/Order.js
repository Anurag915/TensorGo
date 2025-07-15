const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userEmail: String,
  amount: Number,
  productName: String,
  paymentIntentId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
