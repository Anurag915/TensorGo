// Stripe webhook
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook Error:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Save to MongoDB
      try {
        await Payment.create({
          email: session.customer_email,
          amount: session.amount_total / 100,
          currency: session.currency,
          payment_status: session.payment_status,
          stripeId: session.id,
        });

        console.log("✅ Payment saved");
      } catch (err) {
        console.error("❌ Failed to save payment:", err);
      }
    }

    res.json({ received: true });
  }
);
