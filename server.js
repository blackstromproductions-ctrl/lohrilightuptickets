import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const stripe = new Stripe("YOUR_SECRET_KEY"); // Replace with your LIVE secret key from Stripe dashboard

app.use(cors());
app.use(express.json());

// Create Stripe Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { tickets } = req.body;

    const lineItems = tickets.map(t => ({
      price_data: {
        currency: "eur",
        product_data: { name: t.name },
        unit_amount: Math.round(t.price * 100), // convert to cents
      },
      quantity: t.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:4242/success",
      cancel_url: "http://localhost:4242/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => console.log("✅ Stripe server running on http://localhost:4242"));