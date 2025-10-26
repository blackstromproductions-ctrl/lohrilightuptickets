// server.js
import express from "express";
import cors from "cors";
import Stripe from "stripe";

const app = express();
app.use(cors());
app.use(express.json());

const stripe = new Stripe("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"); // Replace with your Stripe Secret Key

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { totalAmount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Event Tickets",
            },
            unit_amount: Math.round(totalAmount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:4242/success",
      cancel_url: "http://localhost:4242/cancel",
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error("Stripe error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Stripe server running successfully!");
});

app.listen(4242, () => console.log("🚀 Server running on http://localhost:4242"));