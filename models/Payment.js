// const mongoose = require("mongoose");

// const paymentSchema = new mongoose.Schema({
//   email: String,
//   amount: Number,
//   currency: String,
//   payment_status: String,
//   stripeId: String,
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.model("Payment", paymentSchema);


const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  currency: String,
  payment_status: String,
  stripeId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
