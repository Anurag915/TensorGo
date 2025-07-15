// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const passport = require("passport");
// const session = require("express-session");
// const authRoutes = require("./routes/auth");
// const passportConfig = require("./config/passport");
// require("dotenv").config(); // this must be the first line
// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");

// const app = express();
// const paymentRoutes = require("./routes/payment");

// app.use(
//   "/api/payment/webhook",
//   require("body-parser").raw({ type: "application/json" })
// );
// // app.use(bodyParser.json());
// app.use(cookieParser());

// // app.use(express.json());

// const cors = require("cors");
// app.use(
//   cors({
//     origin: "http://localhost:5173", // your React frontend
//     credentials: true, // allow cookies to be sent
//   })
// );
// // MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// // Sessions
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: false, // Set to true if using HTTPS
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// // Passport
// app.use(passport.initialize());
// app.use(passport.session());

// // Routes
// // app.use("/auth", authRoutes);
// // app.use("/api/payment", paymentRoutes);

// app.use("/auth", express.json(), authRoutes);
// app.use("/api/payment", express.json(), paymentRoutes);


// // Root Route
// app.get("/", (req, res) => {
//   res.send("Welcome to the OAuth Demo");
// });

// // Start server
// app.listen(process.env.PORT, () => {
//   console.log(`Server running on port ${process.env.PORT}`);
// });



require("dotenv").config(); // Must be first
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const paymentRoutes = require("./routes/payment");

const app = express();

// ✅ Stripe Webhook: raw body for this route only
app.use(
  "/api/payment/webhook",
  bodyParser.raw({ type: "application/json" })
);

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ✅ Cookie Parser for sessions
app.use(cookieParser());

// ✅ Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// ✅ Passport Setup
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

// ✅ MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ Routes
app.use("/auth", express.json(), authRoutes);
app.use("/api/payment", express.json(), paymentRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the OAuth Demo");
});

// Server Listen
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
