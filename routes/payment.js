const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const bodyParser = require("body-parser");
const Payment = require("../models/Payment");
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Dummy products
const products = [
  {
    id: 1,
    title: "Tensorgo AI Plan",
    price: 999,
    image: "https://via.placeholder.com/150",
  },
  {
    id: 2,
    title: "Monthly Access",
    price: 299,
    image: "https://via.placeholder.com/150",
  },
];

// Stripe Checkout Route
router.post("/create-checkout-session", async (req, res) => {
  const { productId } = req.body;
  const product = products.find((p) => p.id === productId);

  if (!product) return res.status(400).json({ error: "Invalid product" });

  try {
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   mode: "payment",
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "inr",
    //         product_data: {
    //           name: product.title,
    //           images: [product.image],
    //         },
    //         unit_amount: product.price * 100,
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   success_url: `${process.env.FRONTEND_URL}/success`,
    //   cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    // });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.title,
              images: [product.image],
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      // 🔥 Add this line to collect buyer's email:
      // customer_email: "anurag.test.user@gmail.com", // TEMP: hardcode for now
      customer_email: req.user?.email,
      // Or use from session if logged-in user exists
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).json({ error: "Payment failed" });
  }
});


// router.post("/webhook", (req, res) => {
//   console.log("🔥 Webhook reached (basic test)");
//   res.status(200).send("ok");
// });


// Stripe webhook route
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    console.log("🔥 Webhook received");

    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Signature Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("✅ Event type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("💡 Session received:", session);

      const payload = {
        email: session.customer_email || "no-email",
        amount: session.amount_total / 100,
        currency: session.currency,
        payment_status: session.payment_status,
        stripeId: session.id,
      };

      console.log("📦 Payload to save:", payload);

      try {
        const saved = await Payment.create(payload);
        console.log("✅ Payment saved to DB:", saved);
      } catch (err) {
        console.error("❌ MongoDB Save Error:", err.message);
      }
    }

    res.status(200).send("Webhook handled");
  }
);


module.exports = router;
